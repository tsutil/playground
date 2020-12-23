import { github } from './github-client';

export async function* query(route: string, parameters) {
    const options = github.request.endpoint(route, parameters);
    const method = options.method;
    const headers = options.headers;
    let url = options.url;
    while (url != null) {
        const rawResponse = await github.request({ method, url, headers });
        const { response, nextPageUrl } = parseGithubResponse(rawResponse);
        url = nextPageUrl;
        if (Array.isArray(response?.data)) {
            for(const item of response.data){
                yield item;
            }
        } else if(response?.data != null) {
            yield response.data;
        }
    }
}

/**
 * Post process response (from @octokit/plugin-paginate-rest)
 */
function parseGithubResponse(response) {
    const responseNeedsNormalization = 'total_count' in response.data && !('url' in response.data);
    if (!responseNeedsNormalization) {
        return { response };
    }
    // keep the additional properties intact as there is currently no other way
    // to retrieve the same information.
    const incompleteResults = response.data.incomplete_results;
    const repositorySelection = response.data.repository_selection;
    const totalCount = response.data.total_count;
    delete response.data.incomplete_results;
    delete response.data.repository_selection;
    delete response.data.total_count;
    const namespaceKey = Object.keys(response.data)[0];
    const data = response.data[namespaceKey];
    response.data = data;
    if (typeof incompleteResults !== 'undefined') {
        response.data.incomplete_results = incompleteResults;
    }
    if (typeof repositorySelection !== 'undefined') {
        response.data.repository_selection = repositorySelection;
    }
    response.data.total_count = totalCount;

    // `response.headers.link` format:
    // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
    // sets `url` to undefined if "next" URL is not present or `link` header is not set
    const nextPageUrl: string = ((response.headers.link || '').match(/<([^>]+)>;\s*rel="next"/) || [])[1];
    return { response, nextPageUrl };
}

# Overview

*Intelligence* - ability to acquire and apply knowledge and skills.

*Data Science* - area of expertise that allows to extract knowledge from data.

*Big Data* - quality of project that usually implies high volume and / or high velocity of data.

*Data Analytics* - process of analyzing the data in order to obtain derived conclusions. Conclusions can be:
- descriptive - what has happened
- diagnostic - why something has happened
- prescriptive - how to react in the future

## Data

Optional steps for data pre-processing:
- fill missing values
- remove undesired irregularities
- transforming and reducing

## Algorithms Overview

Classification by input data:
- **Supervised learning** - uses labeled data (expected classification tag)
- **Unsupervised learning** - uses unlabeled data
- **Semi-Supervised learning** - some data is partially labeled
- **Reinfocement learning** - machine is provided with external feedback after each computation

Classification by output type:
- **Regression** algorithms return real or countable result, e.g. price.
- **Classification** algorithms return element from finite set, e.g. color name.

Classification by goals:
- **Cluster analysis** group common data together in cluster
- **Dimensionality reduction** reduce the complexity of the data
- **Anomaly detection**
- **Association** (customer might also be interested to)

## Supervised learning

### Linear regression

[Linear regression](https://en.wikipedia.org/wiki/Linear_regression) is a linear approach to modelling the relationship between a scalar response and one or more explanatory variables.

Relationships are modeled using linear predictor functions whose unknown model parameters are estimated from the data.

Applications:
- prediction, forecasting, or error reduction
- quantify the strength of the relationship between the response and the explanatory variables

### Logistics model

[Logistic model](https://en.wikipedia.org/wiki/Logistic_regression) is used to model the probability of a certain class or event existing such as pass/fail, win/lose, alive/dead or healthy/sick.

Applications:
- classification, prediction

### K-Nearest neighbors

[K-nearest neighbors algorithm](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm) is a non-parametric method used for classification and regression. Requires presence of labeled samples, assumes that similar units exist in close proximity to one another.

Applications:
- classification

## Unsupervised learning

### K-Means Clustering

[K-Means Clustering](https://en.wikipedia.org/wiki/K-means_clustering) is a method of cluster analysis that does not require labeled samples.

Given a set of observations (x1, x2, ..., xn), where each observation is a d-dimensional real vector, k-means clustering aims to partition the n observations into k (≤ n) sets S = {S1, S2, ..., Sk} to minimize the within-cluster sum of squares.

Applications:
- vector quantization (reduce dimension size of input data)
- cluster analysis
- [feature learning](https://en.wikipedia.org/wiki/Feature_learning)

### Principal Components Analysis

[Principal Components Analysis](https://en.wikipedia.org/wiki/Principal_component_analysis) is a method of cluster analysis that tries to find best fitting and uncorrelated data dimensions (principal components).

Principal components of a collection of points in a real p-space are a sequence of p direction vectors, where the i-th vector is the direction of a line that best fits the data while being orthogonal to the first i - 1 vectors.

- [financial mathematics](https://en.wikipedia.org/wiki/Mathematical_finance), risk management
- [neuroscience](https://en.wikipedia.org/wiki/Neuroscience)

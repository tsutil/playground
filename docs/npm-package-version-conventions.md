## Package versions

(Semantic version reference conventions)[https://docs.npmjs.com/cli/v6/using-npm/semver] for npm packages:

**x/\*-ranges**
```
0.0.0 <= *
1.0.0 <= 1.x   < 2.0.0
1.2.0 <= 1.2.x < 1.3.0
```

**~version** - *Approximately equivalent to version*, will update to all future patch versions, without incrementing the minor version.
```
1.2.3 <= ~1.2.3 < 1.3.0
1.2.0 <= ~1.2   < 1.3.0 (Same as 1.2.x)
1.0.0 <= ~1     < 2.0.0 (Same as 1.x)
0.2.3 <= ~0.2.3 < 0.3.0
0.2.0 <= ~0.2   < 0.3.0 (Same as 0.2.x)
0.0.0 <= ~0     < 1.0.0 (Same as 0.x)
```

**^version** *Compatible with version*, will update to all future minor/patch versions, without incrementing the major version.
```
1.2.3 <= ^1.2.3 < 2.0.0
0.2.3 <= ^0.2.3 < 0.3.0
0.0.3 <= ^0.0.3 < 0.0.4
```

**hyphen ranges** will specify the inclusive range.
```
1.2.3 <= "1.2.3 - 2.3.4" <= 2.3.4
1.2.0 <= "1.2 - 2.3.4"   <= 2.3.4
```

**pre-release tags**
If a version has a prerelease tag (for example, 1.2.3-alpha.3) then it will only be allowed to satisfy comparator sets if at least one comparator with the same [major, minor, patch] tuple also has a prerelease tag.

For example, the range >1.2.3-alpha.3 would be allowed to match the version 1.2.3-alpha.7, but it would not be satisfied by 3.4.5-alpha.9

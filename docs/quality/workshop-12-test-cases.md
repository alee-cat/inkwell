## Workshop 12: PostService.search() Test Cases
| # | Technique | Input | Expected Outcome |
|---|---|---|---|
| 1 | Black-box (valid input) | Query "meow" | Returns mocked search results |
| 2 | Black-box (empty input) | Empty query "" | Returns an empty array |
| 3 | Black-box (no results) | Query "paws" | Returns an empty array |
| 4 | Black-box (multiple results) | Query "cat" | Returns three mocked posts |
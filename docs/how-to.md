---
title: 'How to'
date: '2023-08-04'
---

## Add/Edit scopes

You can create new scopes in two different ways:

### Option 1

1. Edit the Pitch or Bet issue
2. Add your scope under the scope section

See this [example](https://github.com/asyncapi/studio/issues/748)



### Option 2

1. Create a new issue
2. Add this keywork in the description `related to #ISSUE_BET_NUMBER`

See this [example](https://github.com/asyncapi/studio/issues/755)


## Communicating progress

You can communicate progress at any time in any issue or pull request (as long as it's part of the tracked Github project). To do so, you have to leave a comment in the issue or pull request with the following syntax:

```
/progress <percentage> [message]
```
or

```
/progress <percentage>

A multiline message.
It supports Markdown.
```

### Examples

```
/progress 40 We\'re still figuring out how to implement this. We have an idea but it is not yet confirmed it will work.
```

```
/progress 50

A few notes:
* We got this figured out :tada:
* We\'re going to use [this library](#link-to-website) to avoid losing time implementing this algorithm.
* We decided to go for the quickest solution and will improve it if we got time at the end of the cycle.
```


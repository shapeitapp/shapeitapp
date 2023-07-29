This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started


1. If the Github project you want to connect does not already exist, navigate to your Github profile and create a new Project using the URL https://github.com/users/[your-username]/projects/.
2. Login to https://shapeit.app/ and follow the provided steps to connect your Github project.
3. Add some Bets to you project.

### Scopes

1. In order to collect scopes a Bet must follow a certain template, we recommend to use [this one](./github/ISSUE_TEMPLATE/pitch.yml).
2. Add this [github workflow](./github/workflows/add-scope-to-bet.yml) to your project as well.

Examples:

- https://shapeit.app/projects/org/asyncapi/16/cycles/e4232524
- https://shapeit.app/projects/user/Amzani/4/cycles/85c4c7ba


## Contribute

Create a file called `.env.local` with the following lines:

```
GITHUB_CLIENT_ID=xxxx
GITHUB_CLIENT_SECRET=xxxx
GITHUB_REDIRECT_URI=https://localhost:3000/api/auth/callback/github
GITHUB_TOKEN=xxxx
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=yyyyy
NEXT_PUBLIC_SITE_URL=http://localhost:3000/
```

To get a `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` go to your [Github settings](https://github.com/settings/developers) and create a new OAuth app.
`GITHUB_TOKEN` is needed to access public project without authentication.

> You can create a new personal token [here](https://github.com/settings/tokens). Make sure it has, at least, the following scopes: `public_repo`, `read:project`, `read:user`.

Then, run the development server:

```bash
npm install
npm run dev
```

### Tests

```
npm run cypress:run
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the Shape Up application.

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


## Roadmap

https://shapeit.app/projects/org/shapeitapp/1

[Pitch a new feature request](https://github.com/shapeitapp/shapeitapp/issues/new?assignees=&labels=Pitch&projects=&template=pitch.yaml&title=%5BPITCH%5D%3A)
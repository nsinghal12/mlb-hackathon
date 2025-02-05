# MLB Hackathon

This project contains my submission code for the MLB
hackathon.

# Running locally

Once you have started both `server` and `ui`, open
http://localhost:1234/ to view the application.

## Starting server

```sh
$ cd server
$ yarn
$ yarn watch
```

## React UI

```sh
$ cd ui
$ yarn
$ yarn watch
```

# Usage

- Open http://localhost:1234/
- Click on Download in sidebar
  - Click on each button one by one, waiting for confirmation toast
- Click on Teams
  - Search for a team and click "Add favorite" button
- Click on Players
  - Search for a player and click "Add favorite" button
- Click on Analyze
  - Click on each button once
- Finally, click on Digest followed by Create Digest button
  - Now choose a date and the duration you want to use
  - In a minute or two, your digest would be created

# Why download, and analyze?

`Download` and `Analyze` options in the sidebar mimic a local
database by caching JSON files on disk. This allows us to prevent
network calls repeatedly as they are rate limited. It also helps
write a simple API to read/write objects.

`Analyze` mimics the behavior where details are precomputed as
games happen in time.

# Author

- Niti Singhal

# License

(c) Copyright 2025. MIT License.

# CURSEIT

## Troubleshooting

- when running `npx nx run foods-prisma:docker`, the error is:
  - `...permission denied while trying to connect to the Docker daemon socket...`
  - but it works if adding `sudo`
  - SOLUTION: run `sudo usermod -aG docker $USER` — this will add current user to the docker group
  - restart WSL
  - ONLY DEV ENVIRONMENT

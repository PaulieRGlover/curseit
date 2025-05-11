# CURSEIT

## Set up

```
chmod +x setup.sh
./setup.sh
```
Then restart VSCode

If not needed, remove .vscode/keybindings.json

## Troubleshooting

- when running `npx nx run diet-prisma:docker`, the error is:
  - `...permission denied while trying to connect to the Docker daemon socket...`
  - but it works if adding `sudo`
  - SOLUTION: run `sudo usermod -aG docker $USER` — this will add current user to the docker group
  - restart WSL
  - ONLY DEV ENVIRONMENT

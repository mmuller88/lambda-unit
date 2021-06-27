# lambda-unit

# Unit tests

```
./node_modules/jest/bin/jest.js --passWithNoTests --all --updateSnapshot
```

# Misc

yes | yarn cdkDestroy 'pipe-stack' && yarn cdkDeploy 'pipe-stack' --require-approval never
yes | yarn cdkDestroy 'api-stack-dev' && yarn cdkDeploy 'api-stack-dev' --require-approval never

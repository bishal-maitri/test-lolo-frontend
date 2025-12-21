# Lolo Frontend Deploy Pipeline Definition

## The Workflow in Action

1. Your `git push` will fire the Cloud Build Trigger.
2. Cloud Build will run the steps in `cloudbuild.yaml`.
3. It will build and push your image to Artifact Registry, tagged with the **commit SHA**.
4. It will create a new release in Cloud Deploy named `rel-${SHORT_SHA}`.
5. Cloud Deploy will see this new release and automatically deploy it to the `dev` target. The `my-app-dev` Cloud Run service will be created or updated.
6. Go to the Cloud Deploy dashboard. You will see your pipeline, the new release, and its successful deployment to `dev`.
7. The pipeline will show the `prod` stage as "Pending Approval" (because we set `requireApproval: true`).
8. Click "Promote" and then "Approve" the deployment to `prod`.
9. Cloud Deploy will now deploy that exact same image to your `prod` target, updating the `my-app-prod` service.

## Diagram of the Workflow

```mermaid
graph TD
    subgraph "1. CI Phase (Cloud Build)"
        A[Git Push] --> B(cloudbuild-dev.yaml);
        B --> C{1a. Unit Tests};
        C -- Pass --> D{1b. Build Images};
        D --> E[1c. Create Release];
    end

    subgraph "2. CD Phase (Cloud Deploy)"
        E -- Triggers --> F(clouddeploy-main.yaml);
        F -- Defines Pipeline --> G[Stage: dev];
        G -- Deploys to --> H(Target: uselolo-lolo-app-dev-1);
        H -- Uses Profile --> I(skaffold.yaml - dev profile);
        I -- Deploys & Verifies --> J[Cloud Run: ci-pipleline-service-dev];

        J -- Promote --> K[Stage: staging];
        K -- Deploys to --> L(Target: run-frontend-staging);
        L -- Uses Profile --> M(skaffold.yaml - staging profile);
        M -- Deploys & Verifies --> N[Cloud Run: lolo-frontend-staging];

        N -- Promote --> O[Stage: prod];
        O -- Requires Approval --> P{Manual Approval};
        P -- Approved --> Q(Target: run-frontend-prod);
        Q -- Uses Profile --> R(skaffold.yaml - prod profile);
        R -- Deploys --> S[Cloud Run: lolo-frontend-prod];
    end

    subgraph "Skaffold Configuration"
        I --> T{Deploy Config};
        I --> U{Verify Config};
        M --> T;
        M --> U;
        R --> T;
        R --> U;
    end

    style F fill:#cde4ff,stroke:#99bde4
    style B fill:#cde4ff,stroke:#99bde4
    style I fill:#cde4ff,stroke:#99bde4
    style M fill:#cde4ff,stroke:#99bde4
    style R fill:#cde4ff,stroke:#99bde4
```

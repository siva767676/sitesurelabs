# CodeBuild definition (prepared, NOT needed and not applied)

The images were instead built and pushed from a machine with Docker Desktop (see `docs/SEO_PRODUCTION_READINESS.md`). This folder is kept only as an alternative; `deploy/verify-image-matrix.sh` is the check that was run.


Builds the SiteSureLabs frontend and backend images, verifies the frontend image, and pushes both to ECR only if every
check passes. **Nothing in this folder has been applied to AWS.**

- `buildspec.yml`: builds both images, runs `nginx -t`, runs the full HTTP status and redirect matrix (including the
  13-URL sitemap) against the new frontend image, then pushes `sitesurelabs-frontend` and `sitesurelabs-backend`
  tagged with the git commit and `latest`.
- `trust.json`, `policy.json`: a dedicated CodeBuild role limited to a private source bucket, CloudWatch logs and the two
  `sitesurelabs-*` ECR repositories. It cannot touch the `anviksha-*` or `sitevision-*` repositories.

Already created (empty, new, isolated): ECR repositories `sitesurelabs-frontend` and `sitesurelabs-backend`, and the
private encrypted bucket `sitesurelabs-build-src-196338354246` (ap-south-1).

Needs the owner's approval: creating the role `sitesurelabs-codebuild-role` and the CodeBuild project. See
`docs/SEO_PRODUCTION_READINESS.md` (sections 13 and 14) for the production architecture, the deployment plan and the rollback.

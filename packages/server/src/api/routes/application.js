const Router = require("@koa/router")
const controller = require("../controllers/application")
const authorized = require("../../middleware/authorized")
const { quotaMiddleware: quota, QuotaTypes } = require("../../middleware/quota")
const { BUILDER } = require("@budibase/auth/permissions")

const router = Router()

router
  .post(
    "/api/applications",
    authorized(BUILDER),
    quota(QuotaTypes.APPS),
    controller.create
  )
  .get("/api/applications/:appId/definition", controller.fetchAppDefinition)
  .get("/api/applications", controller.fetch)
  .get("/api/applications/:appId/appPackage", controller.fetchAppPackage)
  .put("/api/applications/:appId", authorized(BUILDER), controller.update)
  .post(
    "/api/applications/:appId/client/update",
    authorized(BUILDER),
    controller.updateClient
  )
  .post(
    "/api/applications/:appId/client/revert",
    authorized(BUILDER),
    controller.revertClient
  )
  .delete("/api/applications/:appId", authorized(BUILDER), controller.delete)

module.exports = router

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({
    message: "👋 Welcome to the Case Management API!",
    description: "Use the endpoints below to manage case tasks.",
    endpoints: {
      createCase: {
        method: "POST",
        path: "/cases",
        description: "Create a new case"
      },
      getAllCases: {
        method: "GET",
        path: "/cases",
        description: "Retrieve all cases"
      },
      getCaseById: {
        method: "GET",
        path: "/cases/:id",
        description: "Retrieve a case by ID"
      },
      updateCaseStatus: {
        method: "PATCH",
        path: "/cases/:id/status",
        description: "Update the status of a case"
      },
      updateCasePriority: {
        method: "PATCH",
        path: "/cases/:id/priority",
        description: "Update the priority of a case"
      },
      deleteCase: {
        method: "DELETE",
        path: "/cases/:id",
        description: "Delete a case by ID"
      }
    },
    note: "All IDs are UUIDs. Make sure to use valid IDs and valid status/priority values."
  });
});

module.exports = router;

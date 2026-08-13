# Backlog API v2 Postman collection

This directory contains an importable Postman collection for the Backlog API v2 and a matching environment for the DATT Japan workspace.

## Files

- `backlog-api.postman_collection.json` — flat collection of Backlog API requests.
- `backlog-local.postman_environment.json` — local `baseUrl` and `apiKey` values.
- `API_REFERENCE.md` — generated inventory of the requests included in the collection.

## Import into Postman

1. Open Postman and select **Import**.
2. Import `backlog-api.postman_collection.json`.
3. Import `backlog-local.postman_environment.json`.
4. Select **Backlog - DATT Japan** from the environment selector.
5. Open a request and replace any placeholder path variables before sending it.

## Authentication

Requests use Backlog API-key authentication through the `apiKey` query parameter:

```text
{{baseUrl}}/api/v2/space?apiKey={{apiKey}}
```

OAuth is not used by this collection.

## Variables

The environment provides:

| Variable | Purpose | Example |
| --- | --- | --- |
| `baseUrl` | Backlog workspace origin without a trailing slash | `https://dattjapan.backlog.com` |
| `apiKey` | Backlog API key | Secret value |

The collection also defines placeholders such as `projectIdOrKey`, `issueIdOrKey`, `userId`, `wikiId`, and `attachmentId`. Set their current values in Postman or edit them in the request URL.

## Request bodies

POST, PUT, and PATCH requests include an empty `x-www-form-urlencoded` body. Add the fields required by the corresponding endpoint before sending the request. File-upload endpoints must be changed to `form-data` and supplied with the appropriate file.

The authoritative field definitions, permissions, and response formats are available in the [Backlog API documentation](https://developer.nulab.com/docs/backlog/api/2/get-space/).

## Safety

The environment file contains a usable API key in plaintext. Do not commit, publish, or share it. Prefer keeping a sanitized environment in source control and setting the current secret locally in Postman. Rotate the key immediately if it has been exposed outside its intended audience.

Write operations can modify or delete Backlog data. Review the URL, workspace, parameters, and body before sending POST, PUT, PATCH, or DELETE requests.

## Included API requests


The collection contains 151 Backlog API v2 requests:

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 1 | Space - Get Space | `GET` | `{{baseUrl}}/api/v2/space?apiKey={{apiKey}}` |
| 2 | Space - Get Recent Updates | `GET` | `{{baseUrl}}/api/v2/space/activities?apiKey={{apiKey}}` |
| 3 | Space - Get Activity | `GET` | `{{baseUrl}}/api/v2/activities/{{activityId}}?apiKey={{apiKey}}` |
| 4 | Space - Get Space Logo | `GET` | `{{baseUrl}}/api/v2/space/image?apiKey={{apiKey}}` |
| 5 | Space - Get Space Notification | `GET` | `{{baseUrl}}/api/v2/space/notification?apiKey={{apiKey}}` |
| 6 | Space - Update Space Notification | `PUT` | `{{baseUrl}}/api/v2/space/notification?apiKey={{apiKey}}` |
| 7 | Space - Get Space Disk Usage | `GET` | `{{baseUrl}}/api/v2/space/diskUsage?apiKey={{apiKey}}` |
| 8 | Attachments - Post Attachment File | `POST` | `{{baseUrl}}/api/v2/space/attachment?apiKey={{apiKey}}` |
| 9 | Users - Get User List | `GET` | `{{baseUrl}}/api/v2/users?apiKey={{apiKey}}` |
| 10 | Users - Get User | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}?apiKey={{apiKey}}` |
| 11 | Users - Get Own User | `GET` | `{{baseUrl}}/api/v2/users/myself?apiKey={{apiKey}}` |
| 12 | Users - Get User Icon | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}/icon?apiKey={{apiKey}}` |
| 13 | Users - Get User Recent Updates | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}/activities?apiKey={{apiKey}}` |
| 14 | Users - Get Received Star List | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}/stars?apiKey={{apiKey}}` |
| 15 | Users - Count User Received Stars | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}/stars/count?apiKey={{apiKey}}` |
| 16 | Users - Get Recently Viewed Issues | `GET` | `{{baseUrl}}/api/v2/users/myself/recentlyViewedIssues?apiKey={{apiKey}}` |
| 17 | Users - Add Recently Viewed Issue | `POST` | `{{baseUrl}}/api/v2/users/myself/recentlyViewedIssues?apiKey={{apiKey}}` |
| 18 | Users - Get Recently Viewed Projects | `GET` | `{{baseUrl}}/api/v2/users/myself/recentlyViewedProjects?apiKey={{apiKey}}` |
| 19 | Users - Get Recently Viewed Wikis | `GET` | `{{baseUrl}}/api/v2/users/myself/recentlyViewedWikis?apiKey={{apiKey}}` |
| 20 | Projects - Get Project List | `GET` | `{{baseUrl}}/api/v2/projects?apiKey={{apiKey}}` |
| 21 | Projects - Add Project | `POST` | `{{baseUrl}}/api/v2/projects?apiKey={{apiKey}}` |
| 22 | Projects - Get Project | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}?apiKey={{apiKey}}` |
| 23 | Projects - Update Project | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}?apiKey={{apiKey}}` |
| 24 | Projects - Delete Project | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}?apiKey={{apiKey}}` |
| 25 | Projects - Get Project Icon | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/image?apiKey={{apiKey}}` |
| 26 | Projects - Get Project Recent Updates | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/activities?apiKey={{apiKey}}` |
| 27 | Projects - Add Project User | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/users?apiKey={{apiKey}}` |
| 28 | Projects - Get Project User List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/users?apiKey={{apiKey}}` |
| 29 | Projects - Delete Project User | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/users?apiKey={{apiKey}}` |
| 30 | Projects - Add Project Administrator | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/administrators?apiKey={{apiKey}}` |
| 31 | Projects - Get Project Administrators | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/administrators?apiKey={{apiKey}}` |
| 32 | Projects - Delete Project Administrator | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/administrators?apiKey={{apiKey}}` |
| 33 | Projects - Get Status List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/statuses?apiKey={{apiKey}}` |
| 34 | Projects - Add Status | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/statuses?apiKey={{apiKey}}` |
| 35 | Projects - Update Status | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/statuses/{{statusId}}?apiKey={{apiKey}}` |
| 36 | Projects - Delete Status | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/statuses/{{statusId}}?apiKey={{apiKey}}` |
| 37 | Projects - Update Status Order | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/statuses/updateDisplayOrder?apiKey={{apiKey}}` |
| 38 | Projects - Get Issue Type List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/issueTypes?apiKey={{apiKey}}` |
| 39 | Projects - Add Issue Type | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/issueTypes?apiKey={{apiKey}}` |
| 40 | Projects - Update Issue Type | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/issueTypes/{{id}}?apiKey={{apiKey}}` |
| 41 | Projects - Delete Issue Type | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/issueTypes/{{id}}?apiKey={{apiKey}}` |
| 42 | Projects - Get Category List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/categories?apiKey={{apiKey}}` |
| 43 | Projects - Add Category | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/categories?apiKey={{apiKey}}` |
| 44 | Projects - Update Category | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/categories/{{id}}?apiKey={{apiKey}}` |
| 45 | Projects - Delete Category | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/categories/{{id}}?apiKey={{apiKey}}` |
| 46 | Projects - Get Version/Milestone List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/versions?apiKey={{apiKey}}` |
| 47 | Projects - Add Version/Milestone | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/versions?apiKey={{apiKey}}` |
| 48 | Projects - Update Version/Milestone | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/versions/{{id}}?apiKey={{apiKey}}` |
| 49 | Projects - Delete Version | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/versions/{{id}}?apiKey={{apiKey}}` |
| 50 | Projects - Get Custom Field List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields?apiKey={{apiKey}}` |
| 51 | Projects - Add Custom Field | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields?apiKey={{apiKey}}` |
| 52 | Projects - Update Custom Field | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields/{{id}}?apiKey={{apiKey}}` |
| 53 | Projects - Delete Custom Field | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields/{{id}}?apiKey={{apiKey}}` |
| 54 | Projects - Add Custom Field List Item | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields/{{id}}/items?apiKey={{apiKey}}` |
| 55 | Projects - Update Custom Field List Item | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields/{{id}}/items/{{itemId}}?apiKey={{apiKey}}` |
| 56 | Projects - Delete Custom Field List Item | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields/{{id}}/items/{{itemId}}?apiKey={{apiKey}}` |
| 57 | Projects - Get Shared File List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/files/metadata/{{path}}?apiKey={{apiKey}}` |
| 58 | Projects - Get Shared File | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/files/{{sharedFileId}}?apiKey={{apiKey}}` |
| 59 | Projects - Get Project Disk Usage | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/diskUsage?apiKey={{apiKey}}` |
| 60 | Webhooks - Get Webhook List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/webhooks?apiKey={{apiKey}}` |
| 61 | Webhooks - Add Webhook | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/webhooks?apiKey={{apiKey}}` |
| 62 | Webhooks - Get Webhook | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/webhooks/{{webhookId}}?apiKey={{apiKey}}` |
| 63 | Webhooks - Update Webhook | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/webhooks/{{webhookId}}?apiKey={{apiKey}}` |
| 64 | Webhooks - Delete Webhook | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/webhooks/{{webhookId}}?apiKey={{apiKey}}` |
| 65 | Issues - Get Issue List | `GET` | `{{baseUrl}}/api/v2/issues?apiKey={{apiKey}}` |
| 66 | Issues - Count Issues | `GET` | `{{baseUrl}}/api/v2/issues/count?apiKey={{apiKey}}` |
| 67 | Issues - Add Issue | `POST` | `{{baseUrl}}/api/v2/issues?apiKey={{apiKey}}` |
| 68 | Issues - Get Issue | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}?apiKey={{apiKey}}` |
| 69 | Issues - Update Issue | `PATCH` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}?apiKey={{apiKey}}` |
| 70 | Issues - Delete Issue | `DELETE` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}?apiKey={{apiKey}}` |
| 71 | Issues - Get Comment List | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments?apiKey={{apiKey}}` |
| 72 | Issues - Add Comment | `POST` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments?apiKey={{apiKey}}` |
| 73 | Issues - Count Comments | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments/count?apiKey={{apiKey}}` |
| 74 | Issues - Get Comment | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments/{{commentId}}?apiKey={{apiKey}}` |
| 75 | Issues - Delete Comment | `DELETE` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments/{{commentId}}?apiKey={{apiKey}}` |
| 76 | Issues - Update Comment | `PATCH` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments/{{commentId}}?apiKey={{apiKey}}` |
| 77 | Issues - Get Comment Notifications | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments/{{commentId}}/notifications?apiKey={{apiKey}}` |
| 78 | Issues - Add Comment Notification | `POST` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments/{{commentId}}/notifications?apiKey={{apiKey}}` |
| 79 | Issues - Get Issue Attachments | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/attachments?apiKey={{apiKey}}` |
| 80 | Issues - Get Issue Attachment | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/attachments/{{attachmentId}}?apiKey={{apiKey}}` |
| 81 | Issues - Delete Issue Attachment | `DELETE` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/attachments/{{attachmentId}}?apiKey={{apiKey}}` |
| 82 | Issues - Get Issue Participants | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/participants?apiKey={{apiKey}}` |
| 83 | Issues - Get Linked Shared Files | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/sharedFiles?apiKey={{apiKey}}` |
| 84 | Issues - Link Shared Files | `POST` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/sharedFiles?apiKey={{apiKey}}` |
| 85 | Issues - Remove Shared File Link | `DELETE` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/sharedFiles/{{id}}?apiKey={{apiKey}}` |
| 86 | Issues - Get Related Issues | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/relatedIssues?apiKey={{apiKey}}` |
| 87 | Issues - Add Related Issue | `POST` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/relatedIssues?apiKey={{apiKey}}` |
| 88 | Issues - Remove Related Issue | `DELETE` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/relatedIssues/{{relatedIssueIdOrKey}}?apiKey={{apiKey}}` |
| 89 | Documents - Get Document List | `GET` | `{{baseUrl}}/api/v2/documents?apiKey={{apiKey}}` |
| 90 | Documents - Add Document | `POST` | `{{baseUrl}}/api/v2/documents?apiKey={{apiKey}}` |
| 91 | Documents - Get Document | `GET` | `{{baseUrl}}/api/v2/documents/{{documentId}}?apiKey={{apiKey}}` |
| 92 | Documents - Get Document Tree | `GET` | `{{baseUrl}}/api/v2/documents/tree?apiKey={{apiKey}}` |
| 93 | Documents - Get Document Attachments | `GET` | `{{baseUrl}}/api/v2/documents/{{documentId}}/attachments?apiKey={{apiKey}}` |
| 94 | Documents - Delete Document | `DELETE` | `{{baseUrl}}/api/v2/documents/{{documentId}}?apiKey={{apiKey}}` |
| 95 | Documents - Get Document Comments | `GET` | `{{baseUrl}}/api/v2/documents/{{documentId}}/comments?apiKey={{apiKey}}` |
| 96 | Documents - Add Document Tag | `POST` | `{{baseUrl}}/api/v2/documents/{{documentId}}/tags?apiKey={{apiKey}}` |
| 97 | Documents - Remove Document Tag | `DELETE` | `{{baseUrl}}/api/v2/documents/{{documentId}}/tags/{{tagId}}?apiKey={{apiKey}}` |
| 98 | Documents - Count Documents | `GET` | `{{baseUrl}}/api/v2/documents/count?apiKey={{apiKey}}` |
| 99 | Wikis - Get Wiki Page List | `GET` | `{{baseUrl}}/api/v2/wikis?apiKey={{apiKey}}` |
| 100 | Wikis - Count Wiki Pages | `GET` | `{{baseUrl}}/api/v2/wikis/count?apiKey={{apiKey}}` |
| 101 | Wikis - Get Wiki Tags | `GET` | `{{baseUrl}}/api/v2/wikis/tags?apiKey={{apiKey}}` |
| 102 | Wikis - Add Wiki Page | `POST` | `{{baseUrl}}/api/v2/wikis?apiKey={{apiKey}}` |
| 103 | Wikis - Get Wiki Page | `GET` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}?apiKey={{apiKey}}` |
| 104 | Wikis - Update Wiki Page | `PATCH` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}?apiKey={{apiKey}}` |
| 105 | Wikis - Delete Wiki Page | `DELETE` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}?apiKey={{apiKey}}` |
| 106 | Wikis - Get Wiki Attachments | `GET` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/attachments?apiKey={{apiKey}}` |
| 107 | Wikis - Attach File to Wiki | `POST` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/attachments?apiKey={{apiKey}}` |
| 108 | Wikis - Get Wiki Attachment | `GET` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/attachments/{{attachmentId}}?apiKey={{apiKey}}` |
| 109 | Wikis - Remove Wiki Attachment | `DELETE` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/attachments/{{attachmentId}}?apiKey={{apiKey}}` |
| 110 | Wikis - Get Wiki Shared Files | `GET` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/sharedFiles?apiKey={{apiKey}}` |
| 111 | Wikis - Link Shared Files to Wiki | `POST` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/sharedFiles?apiKey={{apiKey}}` |
| 112 | Wikis - Remove Wiki Shared File Link | `DELETE` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/sharedFiles/{{id}}?apiKey={{apiKey}}` |
| 113 | Wikis - Get Wiki History | `GET` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/history?apiKey={{apiKey}}` |
| 114 | Wikis - Get Wiki Stars | `GET` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/stars?apiKey={{apiKey}}` |
| 115 | Stars - Add Star | `POST` | `{{baseUrl}}/api/v2/stars?apiKey={{apiKey}}` |
| 116 | Stars - Remove Star | `DELETE` | `{{baseUrl}}/api/v2/stars/{{starId}}?apiKey={{apiKey}}` |
| 117 | Notifications - Get Notifications | `GET` | `{{baseUrl}}/api/v2/notifications?apiKey={{apiKey}}` |
| 118 | Notifications - Count Notifications | `GET` | `{{baseUrl}}/api/v2/notifications/count?apiKey={{apiKey}}` |
| 119 | Notifications - Reset Unread Notification Count | `POST` | `{{baseUrl}}/api/v2/notifications/markAsRead?apiKey={{apiKey}}` |
| 120 | Notifications - Mark Notification as Read | `POST` | `{{baseUrl}}/api/v2/notifications/{{id}}/markAsRead?apiKey={{apiKey}}` |
| 121 | Git - Get Git Repositories | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories?apiKey={{apiKey}}` |
| 122 | Git - Get Git Repository | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}?apiKey={{apiKey}}` |
| 123 | Git - Get Pull Request List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests?apiKey={{apiKey}}` |
| 124 | Git - Count Pull Requests | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/count?apiKey={{apiKey}}` |
| 125 | Git - Add Pull Request | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests?apiKey={{apiKey}}` |
| 126 | Git - Get Pull Request | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}?apiKey={{apiKey}}` |
| 127 | Git - Update Pull Request | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}?apiKey={{apiKey}}` |
| 128 | Git - Get Pull Request Comments | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/comments?apiKey={{apiKey}}` |
| 129 | Git - Add Pull Request Comment | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/comments?apiKey={{apiKey}}` |
| 130 | Git - Count Pull Request Comments | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/comments/count?apiKey={{apiKey}}` |
| 131 | Git - Update Pull Request Comment | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/comments/{{commentId}}?apiKey={{apiKey}}` |
| 132 | Git - Get Pull Request Attachments | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/attachments?apiKey={{apiKey}}` |
| 133 | Git - Download Pull Request Attachment | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/attachments/{{attachmentId}}?apiKey={{apiKey}}` |
| 134 | Git - Delete Pull Request Attachment | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/attachments/{{attachmentId}}?apiKey={{apiKey}}` |
| 135 | Watching - Get Watching List | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}/watchings?apiKey={{apiKey}}` |
| 136 | Watching - Count Watching | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}/watchings/count?apiKey={{apiKey}}` |
| 137 | Watching - Get Watching | `GET` | `{{baseUrl}}/api/v2/watchings/{{watchingId}}?apiKey={{apiKey}}` |
| 138 | Watching - Add Watching | `POST` | `{{baseUrl}}/api/v2/watchings?apiKey={{apiKey}}` |
| 139 | Watching - Update Watching | `PATCH` | `{{baseUrl}}/api/v2/watchings/{{watchingId}}?apiKey={{apiKey}}` |
| 140 | Watching - Delete Watching | `DELETE` | `{{baseUrl}}/api/v2/watchings/{{watchingId}}?apiKey={{apiKey}}` |
| 141 | Watching - Mark Watching as Read | `POST` | `{{baseUrl}}/api/v2/watchings/{{watchingId}}/markAsRead?apiKey={{apiKey}}` |
| 142 | Teams - Get Team List | `GET` | `{{baseUrl}}/api/v2/teams?apiKey={{apiKey}}` |
| 143 | Teams - Get Team | `GET` | `{{baseUrl}}/api/v2/teams/{{teamId}}?apiKey={{apiKey}}` |
| 144 | Teams - Get Team Icon | `GET` | `{{baseUrl}}/api/v2/teams/{{teamId}}/icon?apiKey={{apiKey}}` |
| 145 | Teams - Get Project Teams | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/teams?apiKey={{apiKey}}` |
| 146 | Teams - Add Project Team | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/teams?apiKey={{apiKey}}` |
| 147 | Teams - Delete Project Team | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/teams?apiKey={{apiKey}}` |
| 148 | Other - Get Priority List | `GET` | `{{baseUrl}}/api/v2/priorities?apiKey={{apiKey}}` |
| 149 | Other - Get Resolution List | `GET` | `{{baseUrl}}/api/v2/resolutions?apiKey={{apiKey}}` |
| 150 | Other - Get Licence | `GET` | `{{baseUrl}}/api/v2/space/licence?apiKey={{apiKey}}` |
| 151 | Other - Get Rate Limit | `GET` | `{{baseUrl}}/api/v2/rateLimit?apiKey={{apiKey}}` |

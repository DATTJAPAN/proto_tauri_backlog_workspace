# Backlog API v2 request reference

This inventory is generated from `backlog-api.postman_collection.json` and contains 151 requests grouped into 14 resource categories.

## Contents

- [Space](#space) (7)
- [Attachments](#attachments) (1)
- [Users](#users) (11)
- [Projects](#projects) (40)
- [Webhooks](#webhooks) (5)
- [Issues](#issues) (24)
- [Documents](#documents) (10)
- [Wikis](#wikis) (16)
- [Stars](#stars) (2)
- [Notifications](#notifications) (4)
- [Git](#git) (14)
- [Watching](#watching) (7)
- [Teams](#teams) (6)
- [Other](#other) (4)

## Space

Requests: 7

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 1 | Get Space | `GET` | `{{baseUrl}}/api/v2/space?apiKey={{apiKey}}` |
| 2 | Get Recent Updates | `GET` | `{{baseUrl}}/api/v2/space/activities?apiKey={{apiKey}}` |
| 3 | Get Activity | `GET` | `{{baseUrl}}/api/v2/activities/{{activityId}}?apiKey={{apiKey}}` |
| 4 | Get Space Logo | `GET` | `{{baseUrl}}/api/v2/space/image?apiKey={{apiKey}}` |
| 5 | Get Space Notification | `GET` | `{{baseUrl}}/api/v2/space/notification?apiKey={{apiKey}}` |
| 6 | Update Space Notification | `PUT` | `{{baseUrl}}/api/v2/space/notification?apiKey={{apiKey}}` |
| 7 | Get Space Disk Usage | `GET` | `{{baseUrl}}/api/v2/space/diskUsage?apiKey={{apiKey}}` |

## Attachments

Requests: 1

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 8 | Post Attachment File | `POST` | `{{baseUrl}}/api/v2/space/attachment?apiKey={{apiKey}}` |

## Users

Requests: 11

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 9 | Get User List | `GET` | `{{baseUrl}}/api/v2/users?apiKey={{apiKey}}` |
| 10 | Get User | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}?apiKey={{apiKey}}` |
| 11 | Get Own User | `GET` | `{{baseUrl}}/api/v2/users/myself?apiKey={{apiKey}}` |
| 12 | Get User Icon | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}/icon?apiKey={{apiKey}}` |
| 13 | Get User Recent Updates | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}/activities?apiKey={{apiKey}}` |
| 14 | Get Received Star List | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}/stars?apiKey={{apiKey}}` |
| 15 | Count User Received Stars | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}/stars/count?apiKey={{apiKey}}` |
| 16 | Get Recently Viewed Issues | `GET` | `{{baseUrl}}/api/v2/users/myself/recentlyViewedIssues?apiKey={{apiKey}}` |
| 17 | Add Recently Viewed Issue | `POST` | `{{baseUrl}}/api/v2/users/myself/recentlyViewedIssues?apiKey={{apiKey}}` |
| 18 | Get Recently Viewed Projects | `GET` | `{{baseUrl}}/api/v2/users/myself/recentlyViewedProjects?apiKey={{apiKey}}` |
| 19 | Get Recently Viewed Wikis | `GET` | `{{baseUrl}}/api/v2/users/myself/recentlyViewedWikis?apiKey={{apiKey}}` |

## Projects

Requests: 40

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 20 | Get Project List | `GET` | `{{baseUrl}}/api/v2/projects?apiKey={{apiKey}}` |
| 21 | Add Project | `POST` | `{{baseUrl}}/api/v2/projects?apiKey={{apiKey}}` |
| 22 | Get Project | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}?apiKey={{apiKey}}` |
| 23 | Update Project | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}?apiKey={{apiKey}}` |
| 24 | Delete Project | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}?apiKey={{apiKey}}` |
| 25 | Get Project Icon | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/image?apiKey={{apiKey}}` |
| 26 | Get Project Recent Updates | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/activities?apiKey={{apiKey}}` |
| 27 | Add Project User | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/users?apiKey={{apiKey}}` |
| 28 | Get Project User List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/users?apiKey={{apiKey}}` |
| 29 | Delete Project User | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/users?apiKey={{apiKey}}` |
| 30 | Add Project Administrator | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/administrators?apiKey={{apiKey}}` |
| 31 | Get Project Administrators | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/administrators?apiKey={{apiKey}}` |
| 32 | Delete Project Administrator | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/administrators?apiKey={{apiKey}}` |
| 33 | Get Status List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/statuses?apiKey={{apiKey}}` |
| 34 | Add Status | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/statuses?apiKey={{apiKey}}` |
| 35 | Update Status | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/statuses/{{statusId}}?apiKey={{apiKey}}` |
| 36 | Delete Status | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/statuses/{{statusId}}?apiKey={{apiKey}}` |
| 37 | Update Status Order | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/statuses/updateDisplayOrder?apiKey={{apiKey}}` |
| 38 | Get Issue Type List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/issueTypes?apiKey={{apiKey}}` |
| 39 | Add Issue Type | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/issueTypes?apiKey={{apiKey}}` |
| 40 | Update Issue Type | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/issueTypes/{{id}}?apiKey={{apiKey}}` |
| 41 | Delete Issue Type | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/issueTypes/{{id}}?apiKey={{apiKey}}` |
| 42 | Get Category List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/categories?apiKey={{apiKey}}` |
| 43 | Add Category | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/categories?apiKey={{apiKey}}` |
| 44 | Update Category | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/categories/{{id}}?apiKey={{apiKey}}` |
| 45 | Delete Category | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/categories/{{id}}?apiKey={{apiKey}}` |
| 46 | Get Version/Milestone List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/versions?apiKey={{apiKey}}` |
| 47 | Add Version/Milestone | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/versions?apiKey={{apiKey}}` |
| 48 | Update Version/Milestone | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/versions/{{id}}?apiKey={{apiKey}}` |
| 49 | Delete Version | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/versions/{{id}}?apiKey={{apiKey}}` |
| 50 | Get Custom Field List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields?apiKey={{apiKey}}` |
| 51 | Add Custom Field | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields?apiKey={{apiKey}}` |
| 52 | Update Custom Field | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields/{{id}}?apiKey={{apiKey}}` |
| 53 | Delete Custom Field | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields/{{id}}?apiKey={{apiKey}}` |
| 54 | Add Custom Field List Item | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields/{{id}}/items?apiKey={{apiKey}}` |
| 55 | Update Custom Field List Item | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields/{{id}}/items/{{itemId}}?apiKey={{apiKey}}` |
| 56 | Delete Custom Field List Item | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/customFields/{{id}}/items/{{itemId}}?apiKey={{apiKey}}` |
| 57 | Get Shared File List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/files/metadata/{{path}}?apiKey={{apiKey}}` |
| 58 | Get Shared File | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/files/{{sharedFileId}}?apiKey={{apiKey}}` |
| 59 | Get Project Disk Usage | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/diskUsage?apiKey={{apiKey}}` |

## Webhooks

Requests: 5

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 60 | Get Webhook List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/webhooks?apiKey={{apiKey}}` |
| 61 | Add Webhook | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/webhooks?apiKey={{apiKey}}` |
| 62 | Get Webhook | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/webhooks/{{webhookId}}?apiKey={{apiKey}}` |
| 63 | Update Webhook | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/webhooks/{{webhookId}}?apiKey={{apiKey}}` |
| 64 | Delete Webhook | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/webhooks/{{webhookId}}?apiKey={{apiKey}}` |

## Issues

Requests: 24

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 65 | Get Issue List | `GET` | `{{baseUrl}}/api/v2/issues?apiKey={{apiKey}}` |
| 66 | Count Issues | `GET` | `{{baseUrl}}/api/v2/issues/count?apiKey={{apiKey}}` |
| 67 | Add Issue | `POST` | `{{baseUrl}}/api/v2/issues?apiKey={{apiKey}}` |
| 68 | Get Issue | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}?apiKey={{apiKey}}` |
| 69 | Update Issue | `PATCH` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}?apiKey={{apiKey}}` |
| 70 | Delete Issue | `DELETE` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}?apiKey={{apiKey}}` |
| 71 | Get Comment List | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments?apiKey={{apiKey}}` |
| 72 | Add Comment | `POST` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments?apiKey={{apiKey}}` |
| 73 | Count Comments | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments/count?apiKey={{apiKey}}` |
| 74 | Get Comment | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments/{{commentId}}?apiKey={{apiKey}}` |
| 75 | Delete Comment | `DELETE` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments/{{commentId}}?apiKey={{apiKey}}` |
| 76 | Update Comment | `PATCH` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments/{{commentId}}?apiKey={{apiKey}}` |
| 77 | Get Comment Notifications | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments/{{commentId}}/notifications?apiKey={{apiKey}}` |
| 78 | Add Comment Notification | `POST` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/comments/{{commentId}}/notifications?apiKey={{apiKey}}` |
| 79 | Get Issue Attachments | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/attachments?apiKey={{apiKey}}` |
| 80 | Get Issue Attachment | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/attachments/{{attachmentId}}?apiKey={{apiKey}}` |
| 81 | Delete Issue Attachment | `DELETE` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/attachments/{{attachmentId}}?apiKey={{apiKey}}` |
| 82 | Get Issue Participants | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/participants?apiKey={{apiKey}}` |
| 83 | Get Linked Shared Files | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/sharedFiles?apiKey={{apiKey}}` |
| 84 | Link Shared Files | `POST` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/sharedFiles?apiKey={{apiKey}}` |
| 85 | Remove Shared File Link | `DELETE` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/sharedFiles/{{id}}?apiKey={{apiKey}}` |
| 86 | Get Related Issues | `GET` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/relatedIssues?apiKey={{apiKey}}` |
| 87 | Add Related Issue | `POST` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/relatedIssues?apiKey={{apiKey}}` |
| 88 | Remove Related Issue | `DELETE` | `{{baseUrl}}/api/v2/issues/{{issueIdOrKey}}/relatedIssues/{{relatedIssueIdOrKey}}?apiKey={{apiKey}}` |

## Documents

Requests: 10

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 89 | Get Document List | `GET` | `{{baseUrl}}/api/v2/documents?apiKey={{apiKey}}` |
| 90 | Add Document | `POST` | `{{baseUrl}}/api/v2/documents?apiKey={{apiKey}}` |
| 91 | Get Document | `GET` | `{{baseUrl}}/api/v2/documents/{{documentId}}?apiKey={{apiKey}}` |
| 92 | Get Document Tree | `GET` | `{{baseUrl}}/api/v2/documents/tree?apiKey={{apiKey}}` |
| 93 | Get Document Attachments | `GET` | `{{baseUrl}}/api/v2/documents/{{documentId}}/attachments?apiKey={{apiKey}}` |
| 94 | Delete Document | `DELETE` | `{{baseUrl}}/api/v2/documents/{{documentId}}?apiKey={{apiKey}}` |
| 95 | Get Document Comments | `GET` | `{{baseUrl}}/api/v2/documents/{{documentId}}/comments?apiKey={{apiKey}}` |
| 96 | Add Document Tag | `POST` | `{{baseUrl}}/api/v2/documents/{{documentId}}/tags?apiKey={{apiKey}}` |
| 97 | Remove Document Tag | `DELETE` | `{{baseUrl}}/api/v2/documents/{{documentId}}/tags/{{tagId}}?apiKey={{apiKey}}` |
| 98 | Count Documents | `GET` | `{{baseUrl}}/api/v2/documents/count?apiKey={{apiKey}}` |

## Wikis

Requests: 16

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 99 | Get Wiki Page List | `GET` | `{{baseUrl}}/api/v2/wikis?apiKey={{apiKey}}` |
| 100 | Count Wiki Pages | `GET` | `{{baseUrl}}/api/v2/wikis/count?apiKey={{apiKey}}` |
| 101 | Get Wiki Tags | `GET` | `{{baseUrl}}/api/v2/wikis/tags?apiKey={{apiKey}}` |
| 102 | Add Wiki Page | `POST` | `{{baseUrl}}/api/v2/wikis?apiKey={{apiKey}}` |
| 103 | Get Wiki Page | `GET` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}?apiKey={{apiKey}}` |
| 104 | Update Wiki Page | `PATCH` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}?apiKey={{apiKey}}` |
| 105 | Delete Wiki Page | `DELETE` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}?apiKey={{apiKey}}` |
| 106 | Get Wiki Attachments | `GET` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/attachments?apiKey={{apiKey}}` |
| 107 | Attach File to Wiki | `POST` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/attachments?apiKey={{apiKey}}` |
| 108 | Get Wiki Attachment | `GET` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/attachments/{{attachmentId}}?apiKey={{apiKey}}` |
| 109 | Remove Wiki Attachment | `DELETE` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/attachments/{{attachmentId}}?apiKey={{apiKey}}` |
| 110 | Get Wiki Shared Files | `GET` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/sharedFiles?apiKey={{apiKey}}` |
| 111 | Link Shared Files to Wiki | `POST` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/sharedFiles?apiKey={{apiKey}}` |
| 112 | Remove Wiki Shared File Link | `DELETE` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/sharedFiles/{{id}}?apiKey={{apiKey}}` |
| 113 | Get Wiki History | `GET` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/history?apiKey={{apiKey}}` |
| 114 | Get Wiki Stars | `GET` | `{{baseUrl}}/api/v2/wikis/{{wikiId}}/stars?apiKey={{apiKey}}` |

## Stars

Requests: 2

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 115 | Add Star | `POST` | `{{baseUrl}}/api/v2/stars?apiKey={{apiKey}}` |
| 116 | Remove Star | `DELETE` | `{{baseUrl}}/api/v2/stars/{{starId}}?apiKey={{apiKey}}` |

## Notifications

Requests: 4

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 117 | Get Notifications | `GET` | `{{baseUrl}}/api/v2/notifications?apiKey={{apiKey}}` |
| 118 | Count Notifications | `GET` | `{{baseUrl}}/api/v2/notifications/count?apiKey={{apiKey}}` |
| 119 | Reset Unread Notification Count | `POST` | `{{baseUrl}}/api/v2/notifications/markAsRead?apiKey={{apiKey}}` |
| 120 | Mark Notification as Read | `POST` | `{{baseUrl}}/api/v2/notifications/{{id}}/markAsRead?apiKey={{apiKey}}` |

## Git

Requests: 14

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 121 | Get Git Repositories | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories?apiKey={{apiKey}}` |
| 122 | Get Git Repository | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}?apiKey={{apiKey}}` |
| 123 | Get Pull Request List | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests?apiKey={{apiKey}}` |
| 124 | Count Pull Requests | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/count?apiKey={{apiKey}}` |
| 125 | Add Pull Request | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests?apiKey={{apiKey}}` |
| 126 | Get Pull Request | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}?apiKey={{apiKey}}` |
| 127 | Update Pull Request | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}?apiKey={{apiKey}}` |
| 128 | Get Pull Request Comments | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/comments?apiKey={{apiKey}}` |
| 129 | Add Pull Request Comment | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/comments?apiKey={{apiKey}}` |
| 130 | Count Pull Request Comments | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/comments/count?apiKey={{apiKey}}` |
| 131 | Update Pull Request Comment | `PATCH` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/comments/{{commentId}}?apiKey={{apiKey}}` |
| 132 | Get Pull Request Attachments | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/attachments?apiKey={{apiKey}}` |
| 133 | Download Pull Request Attachment | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/attachments/{{attachmentId}}?apiKey={{apiKey}}` |
| 134 | Delete Pull Request Attachment | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/git/repositories/{{repoIdOrName}}/pullRequests/{{number}}/attachments/{{attachmentId}}?apiKey={{apiKey}}` |

## Watching

Requests: 7

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 135 | Get Watching List | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}/watchings?apiKey={{apiKey}}` |
| 136 | Count Watching | `GET` | `{{baseUrl}}/api/v2/users/{{userId}}/watchings/count?apiKey={{apiKey}}` |
| 137 | Get Watching | `GET` | `{{baseUrl}}/api/v2/watchings/{{watchingId}}?apiKey={{apiKey}}` |
| 138 | Add Watching | `POST` | `{{baseUrl}}/api/v2/watchings?apiKey={{apiKey}}` |
| 139 | Update Watching | `PATCH` | `{{baseUrl}}/api/v2/watchings/{{watchingId}}?apiKey={{apiKey}}` |
| 140 | Delete Watching | `DELETE` | `{{baseUrl}}/api/v2/watchings/{{watchingId}}?apiKey={{apiKey}}` |
| 141 | Mark Watching as Read | `POST` | `{{baseUrl}}/api/v2/watchings/{{watchingId}}/markAsRead?apiKey={{apiKey}}` |

## Teams

Requests: 6

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 142 | Get Team List | `GET` | `{{baseUrl}}/api/v2/teams?apiKey={{apiKey}}` |
| 143 | Get Team | `GET` | `{{baseUrl}}/api/v2/teams/{{teamId}}?apiKey={{apiKey}}` |
| 144 | Get Team Icon | `GET` | `{{baseUrl}}/api/v2/teams/{{teamId}}/icon?apiKey={{apiKey}}` |
| 145 | Get Project Teams | `GET` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/teams?apiKey={{apiKey}}` |
| 146 | Add Project Team | `POST` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/teams?apiKey={{apiKey}}` |
| 147 | Delete Project Team | `DELETE` | `{{baseUrl}}/api/v2/projects/{{projectIdOrKey}}/teams?apiKey={{apiKey}}` |

## Other

Requests: 4

| # | API | Method | URL |
| ---: | --- | --- | --- |
| 148 | Get Priority List | `GET` | `{{baseUrl}}/api/v2/priorities?apiKey={{apiKey}}` |
| 149 | Get Resolution List | `GET` | `{{baseUrl}}/api/v2/resolutions?apiKey={{apiKey}}` |
| 150 | Get Licence | `GET` | `{{baseUrl}}/api/v2/space/licence?apiKey={{apiKey}}` |
| 151 | Get Rate Limit | `GET` | `{{baseUrl}}/api/v2/rateLimit?apiKey={{apiKey}}` |


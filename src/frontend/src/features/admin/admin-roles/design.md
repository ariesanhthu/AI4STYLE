features/admin/admin-roles/

# Layout
From Top --> Bottom:
- Header: Role Management 
- SearchBar (temp keep it empty) - Add new button (On the same row)
- RoleList: include many RoleItem. 

## SearchBar
- Also exist in features/admin/components/search-bar.ts, you just need to put it in UI, do not use its logic (we will apply later).

## RoleList
- Role list have hook pagination with cursor.
- A hook need to cache each page with cursor as key and list of roles as value. (limit of cache page is 5 (declare a constant))

## RoleItem
- RoleItem have a row with 4 columns: Name, Description, list of permissions, Action (Edit, Delete) 

## Add button / Edit
- Open RoleForm with default values (if add new) or values of role (if edit)
- RoleForm have 3 fields: Name, Description, list of permissions (checkbox, render it in limit space, can scroll if too many permissions)
- RoleForm have a button Submit/Update and Button cancel
- RoleForm use hook useRoleMutation to handle add/update role (use for delete role too), in roleMutation there is cache for list of permission (fetch from backend)

# Service
- Use apiClient from lib/open-api-client/open-api-client.ts (openapi-ts)
- use type from folder types inside src/features/admin/admin-roles/types

# Style
- Use tailwindcss
- About RoleList, RoleItem, create in global.css, i want to reuse it in other components

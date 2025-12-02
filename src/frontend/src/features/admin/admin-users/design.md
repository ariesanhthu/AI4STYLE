features/admin/admin-Users/

# Layout
From Top --> Bottom:
- Header: User Management 
- SearchBar (temp keep it empty) - Add new button (On the same row)
- UserList: include many UserItem. 

## SearchBar
- Also exist in features/admin/components/search-bar.ts, you just need to put it in UI, do not use its logic (we will apply later).

## UserList
- User list have hook pagination with cursor.
- A hook need to cache each page with cursor as key and list of Users as value. (limit of cache page is 5 (declare a constant))

## UserItem
- UserItem have a row with 4 columns: Name, Description, list of permissions, Action (View, Delete) 

## UserDetail
- When clicking view on UserItem, it will navigate to UserDetail (.../admin/staffs/:id)
- The UserDetail show data from top to bottom: Name, email, phone, address, role (name, permissions), Action (Edit, Delete) 
- There are 3 buttons on the top-right most Save(only apper when in editing mode), Edit, Delete. when clicking Edit, go to editing mode --> Change to X button, click again to cancel editing mode
- The role will become a dropdown list of roles (admin-roles/components/role-select.tsx)

# Service
- Use apiClient from lib/open-api-client/open-api-client.ts (openapi-ts)
- use type from folder types inside src/features/admin/admin-staffs/types (i have define for you)

# Style
- Use tailwindcss
- Use reuse style in global.css

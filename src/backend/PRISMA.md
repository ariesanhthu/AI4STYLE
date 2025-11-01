## File schema.prisma
Functionalities:
- Specifies database provider and connection details.
- Defines the Prisma schema for the project.
- Configures the Prisma Client generator.


## File prisma.config.ts
Functionalities:
- Configures Prisma settings using TypeScript.
- Specifies schema location and migration paths.
- Sets up datasource URL from environment variables, `schema.prisma` will use this URL for database connections.

## Command

- Migration Command:
```
npx prisma migrate dev --name <description>
```


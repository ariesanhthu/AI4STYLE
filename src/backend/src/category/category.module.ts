import { Module } from "@nestjs/common";
import { CategoryAdminController, CategoryClientController } from "./controllers";
import { CategoryService, CategoryValidationService } from "./services";
import { CategoryRepository } from "./repositories/category.repository";

@Module({
  controllers: [CategoryAdminController, CategoryClientController],
  providers: [
    CategoryService, 
    CategoryValidationService,
    {
      provide: "CategoryRepository",
      useClass: CategoryRepository,
    }
  ],
  exports: [CategoryService, "CategoryRepository"],
})
export class CategoryModule {}
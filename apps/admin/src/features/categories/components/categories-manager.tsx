"use client";

import * as React from "react";
import type { PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DEFAULT_PAGE_SIZE, toPageCount } from "@/lib/pagination";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { getCategoryColumns } from "./categories-columns";
import { CreateCategoryDialog } from "./create-category-dialog";
import { PageHeader } from "@/components/page-header";

export function CategoriesManager() {
  const categoriesQuery = useCategories();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const categories = categoriesQuery.data ?? [];
  const pageCount = toPageCount(categories.length, pagination.pageSize);
  const pageData = categories.slice(
    pagination.pageIndex * pagination.pageSize,
    pagination.pageIndex * pagination.pageSize + pagination.pageSize,
  );
  const columns = React.useMemo(() => getCategoryColumns(), []);

  return (
    <>
      <PageHeader
        title="Service categories"
        description="Maintain the service taxonomy customers use when creating requests."
      >
        <Button
          type="button"
          onClick={() => {
            setIsCreateDialogOpen(true);
          }}
        >
          Create category
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-5 px-4 lg:px-6">


        <div className="flex min-w-0 flex-col gap-5">
          {categoriesQuery.isError ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to load categories</AlertTitle>
              <AlertDescription>
                Service categories are unavailable right now.
              </AlertDescription>
            </Alert>
          ) : null}

          <DataTable
            columns={columns}
            data={pageData}
            emptyMessage="No categories found."
            viewportPadding={false}
            pageCount={pageCount}
            totalRows={categories.length}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>

        <CreateCategoryDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </>
  );
}

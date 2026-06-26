import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import "./ProductTable.css";

import SortableProductRow from "./SortableProductRow";

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  onToggleStatus,
  onDragEnd,
}) => {
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th width="50"></th>

              <th>Product</th>

              <th>UOM</th>

              <th>Rate</th>

              <th>Status</th>

              <th>Actions</th>
            </tr>
          </thead>

          <SortableContext
            items={products.map((p) => p._id)}
            strategy={verticalListSortingStrategy}
          >
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty">
                    No Products Found
                  </td>
                </tr>
              )}

              {products.map((product) => (
                <SortableProductRow
                  key={product._id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </div>
    </DndContext>
  );
};

export default ProductTable;

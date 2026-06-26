import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

const SortableProductRow = ({ product, onEdit, onDelete, onToggleStatus }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: product._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? "#f5faff" : "",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {/* Drag Handle */}

      <td {...attributes} {...listeners} className="drag-handle">
        ☰
      </td>

      {/* Product */}

      <td>{product.productName}</td>

      {/* UOM */}

      <td>{product.uom}</td>

      {/* Rate */}

      <td>Rs. {Number(product.rate).toLocaleString()}</td>

      {/* Status */}

      <td>
        <span
          className={product.isActive ? "status-active" : "status-inactive"}
        >
          {product.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Actions */}

      <td>
        <button className="edit-btn" onClick={() => onEdit(product)}>
          Edit
        </button>

        <button
          className={
            product.isActive
              ? "status-btn deactivate-btn"
              : "status-btn activate-btn"
          }
          onClick={() => onToggleStatus(product)}
        >
          {product.isActive ? "Deactivate" : "Activate"}
        </button>

        <button className="delete-btn" onClick={() => onDelete(product._id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default SortableProductRow;

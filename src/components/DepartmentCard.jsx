import EntityCard from './common/EntityCard'

export default function DepartmentCard({ department, onView, onEdit, onDelete }) {
  return (
    <EntityCard
      entity={department}
      type="department"
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}
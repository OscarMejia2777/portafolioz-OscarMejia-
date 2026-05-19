import { useState } from 'react'
import { DndContext, DragEndEvent, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface Task {
  id: string
  title: string
  description: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

function TaskFlow() {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', tasks: [{ id: '1', title: 'Design landing page', description: 'Create wireframes and mockups' }, { id: '2', title: 'Set up CI/CD', description: 'Configure GitHub Actions pipeline' }] },
    { id: 'in-progress', title: 'In Progress', tasks: [{ id: '3', title: 'Implement auth', description: 'Add login/signup with JWT' }] },
    { id: 'done', title: 'Done', tasks: [{ id: '4', title: 'Project setup', description: 'Initialize monorepo structure' }] },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const sourceCol = columns.find(col => col.tasks.some(t => t.id === active.id))
    const targetCol = columns.find(col => col.id === over.id || col.tasks.some(t => t.id === over.id))

    if (!sourceCol || !targetCol) return

    const task = sourceCol.tasks.find(t => t.id === active.id)
    if (!task) return

    const newColumns = columns.map(col => ({
      ...col,
      tasks: col.id === sourceCol.id ? col.tasks.filter(t => t.id !== active.id) : col.tasks,
    }))

    const targetIdx = targetCol.tasks.findIndex(t => t.id === over.id)
    const insertAt = over.id === targetCol.id ? targetCol.tasks.length : targetIdx

    setColumns(newColumns.map(col =>
      col.id === targetCol.id
        ? { ...col, tasks: [...col.tasks.slice(0, insertAt), task, ...col.tasks.slice(insertAt)] }
        : col
    ))
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">TaskFlow</h1>
        <p className="text-zinc-400 mt-1">Drag tasks between columns</p>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map(column => (
            <div key={column.id} className="bg-zinc-800/50 rounded-xl p-4 min-w-[300px] flex-1 border border-zinc-700/50">
              <h2 className="font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${column.id === 'todo' ? 'bg-blue-400' : column.id === 'in-progress' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                {column.title}
                <span className="text-xs text-zinc-500 ml-auto">{column.tasks.length}</span>
              </h2>

              <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {column.tasks.map(task => (
                    <div key={task.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700/50 cursor-grab active:cursor-grabbing hover:border-zinc-600 transition-colors">
                      <h3 className="font-medium text-white text-sm">{task.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{task.description}</p>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  )
}

export default TaskFlow

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { JobApplication, JobStatus } from '../../types/job';
import { KanbanCard } from './KanbanCard';
import { getStatusConfig } from '../../utils/formatters';
import { useJobContext } from '../../context/JobContext';

interface KanbanColumnProps {
  status: JobStatus;
  applications: JobApplication[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, applications }) => {
  const { openAddModal } = useJobContext();
  const config = getStatusConfig(status);

  return (
    <div className="w-80 shrink-0 flex flex-col bg-slate-100/70 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/80 max-h-[calc(100vh-12rem)] overflow-hidden shadow-xs dark:shadow-none">
      {/* Column Header */}
      <div className="p-3.5 px-4 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 tracking-tight">{status}</h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400">
            {applications.length}
          </span>
        </div>

        <button
          onClick={() => openAddModal(status)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 dark:text-slate-500 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          title={`Add application to ${status}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable Card List */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 space-y-3 overflow-y-auto min-h-[150px] transition-colors duration-150 ${
              snapshot.isDraggingOver
                ? 'bg-indigo-50/70 dark:bg-indigo-950/20 ring-1 ring-inset ring-indigo-500/30'
                : ''
            }`}
          >
            {applications.map((app, index) => (
              <KanbanCard key={app.id} application={app} index={index} />
            ))}
            {provided.placeholder}

            {applications.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-32 border border-dashed border-slate-300 dark:border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-center p-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">No applications</span>
                <button
                  onClick={() => openAddModal(status)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-1 font-medium"
                >
                  + Add one
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

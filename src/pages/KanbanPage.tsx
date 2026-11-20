import React, { useState, useMemo } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Plus, Search, KanbanSquare } from 'lucide-react';
import { useJobContext } from '../context/JobContext';
import { KanbanColumn } from '../components/kanban/KanbanColumn';
import { Button } from '../components/common/Button';
import { JobStatus, JobApplication } from '../types/job';

const COLUMNS: JobStatus[] = ['Wishlist', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'];

export const KanbanPage: React.FC = () => {
  const { applications, updateStatus, openAddModal } = useJobContext();
  const [search, setSearch] = useState('');

  // Filter applications by search
  const filteredApps = useMemo(() => {
    if (!search.trim()) return applications;
    const q = search.toLowerCase().trim();
    return applications.filter(
      (app) =>
        app.company.toLowerCase().includes(q) ||
        app.jobTitle.toLowerCase().includes(q) ||
        app.location.toLowerCase().includes(q)
    );
  }, [applications, search]);

  // Group applications by status column
  const columnData = useMemo(() => {
    const map: Record<JobStatus, JobApplication[]> = {
      Wishlist: [],
      Applied: [],
      Assessment: [],
      Interview: [],
      Offer: [],
      Rejected: [],
    };

    filteredApps.forEach((app) => {
      if (map[app.status]) {
        map[app.status].push(app);
      }
    });

    return map;
  }, [filteredApps]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as JobStatus;
    if (COLUMNS.includes(newStatus)) {
      updateStatus(draggableId, newStatus);
    }
  };

  return (
    <div className="space-y-5 flex flex-col h-full">
      {/* Kanban Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <KanbanSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Workflow Kanban</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Drag applications across columns to update pipeline status automatically.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter board..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-xs rounded-xl pl-9 pr-3 py-2 w-48 sm:w-60 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => openAddModal()}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Job
          </Button>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto pb-4 pt-1">
          <div className="flex items-start gap-4 min-w-max">
            {COLUMNS.map((columnStatus) => (
              <KanbanColumn
                key={columnStatus}
                status={columnStatus}
                applications={columnData[columnStatus] || []}
              />
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

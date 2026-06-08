'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Play, FileText, Download, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  type: string;
  duration: number;
  isFree: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface LessonSidebarProps {
  modules: Module[];
  activeLessonId?: string;
  completedLessonIds?: string[];
  onSelectLesson: (lessonId: string) => void;
  isEnrolled: boolean;
}

function LessonIcon({ type }: { type: string }) {
  if (type === 'text') return <FileText className='h-3.5 w-3.5 flex-shrink-0 text-lux-muted' />;
  if (type === 'resource') return <Download className='h-3.5 w-3.5 flex-shrink-0 text-lux-muted' />;
  return <Play className='h-3.5 w-3.5 flex-shrink-0 text-lux-muted' />;
}

export default function LessonSidebar({
  modules, activeLessonId, completedLessonIds = [], onSelectLesson, isEnrolled,
}: LessonSidebarProps) {
  const [openModules, setOpenModules] = useState<Set<string>>(new Set(modules.map(m => m.id)));

  function toggleModule(moduleId: string) {
    setOpenModules(prev => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  }

  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  const completedCount = completedLessonIds.length;

  return (
    <div className='flex flex-col h-full'>
      {/* Progress header */}
      <div className='p-4 border-b border-lux-border bg-lux-bg'>
        <p className='text-xs text-lux-muted mb-2'>Course progress</p>
        <div className='h-1.5 bg-lux-border rounded-full overflow-hidden'>
          <div
            className='h-full bg-gold rounded-full transition-all duration-500'
            style={{ width: `${totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0}%` }}
          />
        </div>
        <p className='text-xs text-lux-mid mt-1'>{completedCount}/{totalLessons} lessons</p>
      </div>

      {/* Module list */}
      <div className='flex-1 overflow-y-auto'>
        {modules.map((module, mi) => {
          const isOpen = openModules.has(module.id);
          const moduleCompleted = module.lessons.every(l => completedLessonIds.includes(l.id));
          return (
            <div key={module.id} className='border-b border-lux-border'>
              <button
                onClick={() => toggleModule(module.id)}
                className='w-full flex items-center justify-between p-4 text-left hover:bg-lux-hover transition-colors duration-200'
              >
                <div className='flex items-center gap-2 min-w-0'>
                  {moduleCompleted ? (
                    <CheckCircle className='h-4 w-4 text-emerald-500 flex-shrink-0' />
                  ) : (
                    <span className='flex-shrink-0 h-5 w-5 rounded-full bg-lux-border text-lux-mid text-xs flex items-center justify-center font-medium'>
                      {mi + 1}
                    </span>
                  )}
                  <span className='text-sm font-medium text-lux-black truncate'>{module.title}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className='h-4 w-4 text-lux-muted flex-shrink-0' />
                ) : (
                  <ChevronRight className='h-4 w-4 text-lux-muted flex-shrink-0' />
                )}
              </button>

              {isOpen && (
                <div className='bg-white'>
                  {module.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isComplete = completedLessonIds.includes(lesson.id);
                    const isLocked = !isEnrolled && !lesson.isFree;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !isLocked && onSelectLesson(lesson.id)}
                        disabled={isLocked}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 text-left border-t border-lux-border/50 transition-all duration-200',
                          isActive && 'bg-gold/5 border-l-2 border-l-gold',
                          !isActive && !isLocked && 'hover:bg-lux-hover cursor-pointer',
                          isLocked && 'opacity-50 cursor-not-allowed',
                        )}
                      >
                        {isComplete ? (
                          <CheckCircle className='h-4 w-4 text-emerald-500 flex-shrink-0' />
                        ) : (
                          <Circle className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-gold' : 'text-lux-border')} />
                        )}
                        <LessonIcon type={lesson.type} />
                        <span className={cn(
                          'text-xs flex-1 truncate',
                          isActive ? 'text-lux-black font-medium' : 'text-lux-mid',
                        )}>
                          {lesson.title}
                        </span>
                        {lesson.duration > 0 && (
                          <span className='text-xs text-lux-muted flex-shrink-0'>{lesson.duration}m</span>
                        )}
                        {lesson.isFree && !isEnrolled && (
                          <span className='text-xs text-emerald-600 flex-shrink-0'>Free</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

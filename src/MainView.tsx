import React, { useState } from 'react';
import ScheduleView from './ScheduleView';
import TaskView from './TaskView';
import FindTaskView from './FindTaskView'
import CreateTaskView from './CreateTaskView'
import WriteReadScheduleView from './WriteReadScheduleView'
import PSSController from './PSSController';

interface MainViewProps {
    controller: PSSController;
}

const MainView: React.FC<MainViewProps> = ({ controller }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [displayedView, setDisplayedView] = useState('');

    const displayOptions = () => {
        setShowOptions(true);
    };

    const display = (view: string) => {
        setDisplayedView(view);
    };
    
    const hideOptions = () => {
        setShowOptions(false);
    };
    
    return (
        <div>
            <h1>Main View</h1>
            <button onClick={displayOptions}>Display Options</button>
            {showOptions && (
                <div>
                    <button onClick={() => display('schedule')}>Schedule View</button>
                    <button onClick={() => display('tasks')}>Task View</button>
                    <button onClick={() => display('findTask')}>Find Task View</button>
                    <button onClick={() => display('createTask')}>Create Task View</button>
                    <button onClick={() => display('writeReadSchedule')}>Write/Read Schedule View</button>
                    <button onClick={hideOptions}>Hide Options</button>
                </div>
            )}
            {displayedView === 'schedule' && <ScheduleView controller={controller} />}
            {displayedView === 'tasks' && <TaskView controller={controller} />}
            {displayedView === 'findTask' && <FindTaskView controller={controller} />}
            {displayedView === 'createTask' && <CreateTaskView controller={controller} />}
            {displayedView === 'writeReadSchedule' && <WriteReadScheduleView controller={controller} />}
        </div>
    );
};

export default MainView;
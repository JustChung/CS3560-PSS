import React from 'react';
import PSSController from './PSSController';

interface CreateTaskViewProps {
    controller: PSSController;
}

const CreateTaskView: React.FC<CreateTaskViewProps> = ({ controller }) => {
    return (
        <div>
            <h2>Schedule View</h2>
        </div>
    );
};

export default CreateTaskView;
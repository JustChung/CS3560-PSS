import React from 'react';
import PSSController from './PSSController';

interface WriteReadScheduleViewProps {
    controller: PSSController;
}

const WriteReadScheduleView: React.FC<WriteReadScheduleViewProps> = ({ controller }) => {
    return (
        <div>
            <h2>Schedule View</h2>
        </div>
    );
};

export default WriteReadScheduleView;
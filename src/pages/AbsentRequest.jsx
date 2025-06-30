import React from "react";
import { Tabs, Tab } from "../components/ui/tabs";
import  Card  from "../components/ui/card";


const AbsentRequest = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Absent Requests</h1>
      <Tabs>
        <Tab title="Pending Requests">
          <Card className="p-4 mt-4">No pending requests.</Card>
        </Tab>
        <Tab title="Approved Requests">
          <Card className="p-4 mt-4">No approved requests.</Card>
        </Tab>
        <Tab title="Rejected Requests">
          <Card className="p-4 mt-4">No rejected requests.</Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AbsentRequest;

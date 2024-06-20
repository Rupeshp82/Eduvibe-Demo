"use client";

import { useState, useEffect } from 'react';

const StudyGroup = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("Send Invite");

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTime(0);
    setIsActive(false);
  };

  const toggleGoal = (index) => {
    const newGoals = [...goals];
    newGoals[index].completed = !newGoals[index].completed;
    setGoals(newGoals);
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, { text: newGoal, completed: false, timeElapsed: 0 }]);
      setNewGoal("");
    }
  };

  const deleteGoal = (index) => {
    const newGoals = goals.filter((_, i) => i !== index);
    setGoals(newGoals);
  };

  const toggleInviteModal = () => {
    setIsInviteModalOpen(!isInviteModalOpen);
  };

  const sendInvite = () => {
    if (inviteEmail.trim()) {
      setInviteStatus("Invite Sent");
      setTimeout(() => {
        setInviteStatus("Send Invite");
        setInviteEmail("");
        setIsInviteModalOpen(false);
      }, 2000); // Reset status after 2 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-2 text-gray-800">Study Timer</h2>
          <div className="text-6xl font-mono text-purple-600 mb-4">{time}s</div>
          <div>
            <button
              onClick={toggleTimer}
              className={`px-4 py-2 rounded-lg text-white mr-2 ${
                isActive ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-blue-500 hover:bg-blue-700'
              }`}
            >
              {isActive ? 'Pause Timer' : 'Start Timer'}
            </button>
            <button
              onClick={resetTimer}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
            >
              Reset Timer
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Study Goals</h2>
          <ul className="space-y-4">
            {goals.map((goal, index) => (
              <li key={index} className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoal(index)}
                  className="mr-4"
                />
                <span className={`flex-1 ${goal.completed ? 'line-through text-gray-400' : ''}`}>
                  {goal.text}
                </span>
                <button
                  onClick={() => deleteGoal(index)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
                {goal.completed && (
                  <span className="text-gray-500 ml-4">Time Elapsed: {goal.timeElapsed}s</span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Add a new goal"
              className="p-2 border rounded-lg flex-1 mr-4"
            />
            <button
              onClick={addGoal}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
            >
              Add Goal
            </button>
          </div>
        </div>
        <button
          onClick={toggleInviteModal}
          className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
        >
          Invite Friends
        </button>
        {isInviteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Invite Friends</h2>
                <button onClick={toggleInviteModal} className="text-gray-500 hover:text-gray-800">
                  &times;
                </button>
              </div>
              <input
                type="text"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter friend's email"
                className="w-full p-2 border rounded-lg mb-4"
              />
              <button
                onClick={sendInvite}
                className={`px-4 py-2 text-white rounded-lg w-full ${
                  inviteStatus === "Invite Sent" ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
                }`}
                disabled={inviteStatus === "Invite Sent"}
              >
                {inviteStatus}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyGroup;

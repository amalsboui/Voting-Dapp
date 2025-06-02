import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom"; 
import { CandidatesPage } from "./CandidatesPage";

const mockCandidates = [
  {
    id: 0,
    name: "Alice",
    description: "Candidate 1",
    image: "https://ipfs.io/ipfs/QmAliceHash",
    votes: 1
  },
  {
    id: 1,
    name: "Bob",
    description: "Candidate 2",
    image: "https://ipfs.io/ipfs/QmBobHash",
    votes: 5
  }
];

// Mock window.ethereum
global.window.ethereum = {
  request: jest.fn().mockResolvedValue([]),
  on: jest.fn(),
  removeListener: jest.fn(),
  isMetaMask: true
};

beforeEach(() => {
  jest.clearAllMocks();
  // Set up localStorage mock for auth token
  Storage.prototype.getItem = jest.fn(() => 'fake-token');
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  localStorage.clear();
});

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter initialEntries={['/candidates']}>
      <Routes>
        <Route path="/candidates" element={component} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CandidatesPage', () => {
  test("renders candidates correctly", async () => {
    renderWithRouter(<CandidatesPage candidates={mockCandidates} />);

    // Verify candidate names are displayed
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    
    // Verify vote counts are displayed
    expect(screen.getByText(/Current Votes: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Current Votes: 5/i)).toBeInTheDocument();

    // Verify images are rendered with correct sources
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', expect.stringContaining('QmAliceHash'));
    expect(images[1]).toHaveAttribute('src', expect.stringContaining('QmBobHash'));
  });

  test("renders the header correctly", () => {
    renderWithRouter(<CandidatesPage candidates={mockCandidates} />);
    expect(screen.getByText("Meet the Candidates")).toBeInTheDocument();
  });
});

import { handleSubmit } from '../formHandler';
import { checkForName } from '../nameChecker';

// Mock the `checkForName` function
jest.mock('../nameChecker');

describe('Testing the submit functionality', () => {
    let form, nameInput, resultsDiv;

    beforeEach(() => {
        // Set up our document body
        document.body.innerHTML = `
            <form id="urlForm">
                <input id="name" value="Picard" />
            </form>
            <div id="results"></div>
        `;

        form = document.getElementById('urlForm');
        nameInput = document.getElementById('name');
        resultsDiv = document.getElementById('results');

        // Mock fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ message: 'Success' }),
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('handleSubmit should be defined', () => {
        expect(handleSubmit).toBeDefined();
    });

    test('should prevent default form submission', () => {
        const event = { preventDefault: jest.fn() };

        handleSubmit(event);

        expect(event.preventDefault).toHaveBeenCalled();
    });

    test('should call checkForName with the form input value', () => {
        const event = { preventDefault: jest.fn() };

        handleSubmit(event);

        expect(checkForName).toHaveBeenCalledWith('Picard');
    });

    test('should send a POST request to the server with the input value', async () => {
        const event = { preventDefault: jest.fn() };

        await handleSubmit(event);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/analyze', expect.objectContaining({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: 'Picard' })
        }));
    });

    test('should display the server response in the #results div', async () => {
        const event = { preventDefault: jest.fn() };
    
        await handleSubmit(event);
    
        // Wait for a short while to ensure the DOM update
        await new Promise(r => setTimeout(r, 0));
    
        expect(resultsDiv.innerText).toBe(JSON.stringify({ message: 'Success' }));
    });

    test('should handle fetch errors', async () => {
        const event = { preventDefault: jest.fn() };
    
        // Mock fetch to throw an error
        global.fetch.mockImplementationOnce(() => Promise.reject('API failure'));
    
        // Mock console.error
        console.error = jest.fn();
    
        await handleSubmit(event);
    
        // Use setTimeout to ensure the error logging happens
        await new Promise(r => setTimeout(r, 0));
    
        // Verify that console.error was called with the expected arguments
        expect(console.error).toHaveBeenCalledWith('Error:', 'API failure');
    });
    
    
});

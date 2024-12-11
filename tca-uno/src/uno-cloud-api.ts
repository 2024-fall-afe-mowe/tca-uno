import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { GameResult } from './game-results';

// Function to save a game result to the cloud
export const saveGameToCloud = async (
  email: string,
  appName: string,
  timestamp: string,
  gameResult: GameResult
) => {
  // Ensure email is provided
  if (!email) {
    console.error('Email is required to save the game result.');
    return;
  }

  // Construct the DynamoDB item
  const dynamoGame = {
    pk: email.toLowerCase(), // Partition key
    sk: `${appName}#${timestamp}`, // Sort key
    ts: timestamp,
    user: email,
    app: appName,
    gsi1pk: appName, // Global Secondary Index partition key
    gsi1sk: timestamp, // Global Secondary Index sort key
    game: gameResult,
  };

  console.log('Unmarshalled Game:', dynamoGame);

  // Marshall the item to DynamoDB format
  const marshalledGame = marshall(dynamoGame, {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  });

  console.log('Marshalled Game:', marshalledGame);

  // Define fetch options
  const options = {
    method: 'POST',
    body: JSON.stringify({
      TableName: 'tca-data',
      Item: marshalledGame,
    }),
  };

  // Send the request to the API Gateway endpoint
  try {
    const response = await fetch(
      'https://32wop75hhc.execute-api.us-east-1.amazonaws.com/prod/data',
      options
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log('Game result saved successfully.');
  } catch (error) {
    console.error('Error saving game result:', error);
  }
};

// Function to load game results from the cloud
export const loadGamesFromCloud = async (email: string, appName: string) => {
  // Ensure email is provided
  if (!email) {
    console.error('Email is required to load game results.');
    return [];
  }

  // Construct the request URL
  const url = `https://32wop75hhc.execute-api.us-east-1.amazonaws.com/prod/data/?user=${email.toLowerCase()}&game=${appName}`;

  console.log('Request URL:', url);

  // Fetch data from the API Gateway endpoint
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    console.log('Marshalled Response:', data);

    // Unmarshall the data from DynamoDB format
    const unmarshalledData = data.Items.map((item: any) => unmarshall(item));

    console.log('Unmarshalled Response:', unmarshalledData);

    // Extract game results
    const gameResults = unmarshalledData.map((item: any) => item.game);
    return gameResults;
  } catch (error) {
    console.error('Error loading game results:', error);
    return [];
  }
};

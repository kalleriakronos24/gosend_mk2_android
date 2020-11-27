import React from 'react';

/**
 * Constants
 */

const port = 8000;
const protocol = 'http';
const uri = '192.168.43.178';

const ENV = 'PROD';

const PROD_PROTOCOL = 'http';
const PROD_URI = '178.1278.96.229';

export const SERVER_URL = ENV === "PROD" ? `${PROD_PROTOCOL}://${PROD_URI}` : `${protocol}://${uri}:${port}`;


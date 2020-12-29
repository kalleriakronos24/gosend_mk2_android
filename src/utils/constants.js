import React from 'react';

/**
 * Constants
 */

const port = 8000;
const protocol = 'http';
const uri = '192.168.43.178';

const ENV = 'DEV';

const PROD_PROTOCOL = 'https';
const PROD_URI = 'www.ongqir-backend.com';

export const SERVER_URL = ENV === "PROD" ? `${PROD_PROTOCOL}://${PROD_URI}` : `${protocol}://${uri}:${port}`;


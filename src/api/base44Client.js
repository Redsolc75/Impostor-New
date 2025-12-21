import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Hem canviat 'requiresAuth' a false perquè no t'expulsi
export const base44 = createClient({
  appId: "6946651c132cf0403fd62248",
  requiresAuth: false 
});

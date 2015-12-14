exports.default = { 
  routes: function(api){
    return {

      get: [
        { path: '/getAddress', action: 'getAddress' }, // (GET) /api/users
        { path: '/getLoc', action: 'getLoc' }, // (GET) /api/users
        { path: '/analysisIMG', action: 'analysisIMG' }, // (GET) /api/users
        { path: '/load', action: 'loadData' }, // (GET) /api/users
        { path: '/search/:term/limit/:limit/offset/:offset', action: 'search' }, // (GET) /api/search/car/limit/10/offset/100
        { path: '/transTainanFrom', action: 'transTainanFrom' }, 
        { path: '/transTainanTo', action: 'transTainanTo' }, 
      ],
      
      /* ---------------------
      routes.js 

      For web clients (http and https) you can define an optional RESTful mapping to help route requests to actions.
      If the client doesn't specify and action in a param, and the base route isn't a named action, the action will attempt to be discerned from this routes.js file.

      Learn more here: http://www.actionherojs.com/docs/servers/web.html

      examples:
      
      get: [
        { path: '/users', action: 'usersList' }, // (GET) /api/users
        { path: '/search/:term/limit/:limit/offset/:offset', action: 'search' }, // (GET) /api/search/car/limit/10/offset/100
      ],

      post: [
        { path: '/login/:userID(^\\d{3}$)', action: 'login' } // (POST) /api/login/123
      ],

      all: [
        { path: '/user/:userID', action: 'user' } // (*) / /api/user/123
      ]
      
      ---------------------- */
      
    }
  }
}
import Auth from "./auth";

export function authHeader() {
  // let user = JSON.parse(localStorage.getItem("user"));
  // if (user && user.authToken) {
  //  
  //     "Authorization": "Bearer " + Auth.get('authToken'),
  return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, Content-Type, Accept"
    };
  }
//   } else {
//     return {
//       "Content-Type": "application/json",
//       "Accept": "application/json",
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Headers": "Origin, Content-Type, Accept"
//     };
//   }
// }

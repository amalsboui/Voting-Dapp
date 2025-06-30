terraform { 
  cloud { 
    
    organization = "hophopp_cc" 

    workspaces { 
      name = "voting-dapp" 
    } 
  } 
}
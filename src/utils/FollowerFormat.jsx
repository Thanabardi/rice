export default function followerFormatter(follower) {
  // format raw int number into form of thousand and million
  if (follower > 999 && follower < 1000000){
    return (follower/1000).toFixed(1) + 'K'; 
  }else if (follower > 1000000){
    return (follower/1000000).toFixed(1) + 'M';  
  }else if (follower < 900){
    return follower
  }
}
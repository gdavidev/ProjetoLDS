function Card() {
  return (
    <div className="flex flex-col w-full h-70">
      <div className="overflow-hidden">
        <a href="#"><img className="w-full" src="https://placehold.co/160x200" alt="" /></a>
      </div>
      <div className="bg-red-600">
        <h3 className="font-bold text-white mx-2">Example</h3>      
      </div>
    </div>
  );
}
export default Card;
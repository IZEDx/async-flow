
import { Pipe, from, map, to } from "./src";

Pipe.pump(  from([ 1, 1, 2, 3, 5, 8 ]) )
    .pipe(  map( x => x * 2 ) )
    .flush( to( console.log ) );


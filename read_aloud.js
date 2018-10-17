// <interpretation grammar=".SENTENCE" score="2" time="8097,234">

// <instance>they saw that water sanitation and hygiene are desperately needed in homes</instance>
// <input>
// <input mode="speech" score="3">they</input>
// <input mode="speech" score="3">saw</input>
// <input mode="speech" score="4">that</input>
// <input mode="speech" score="2">water</input>
// <input mode="speech" score="1">sanitation</input>
// <input mode="speech" score="3">and</input>
// <input mode="speech" score="3">hygiene</input>
// <input mode="speech" score="1">are</input>
// <input mode="speech" score="1">desperately</input>
// <input mode="speech" score="1">needed</input>
// <input mode="speech" score="2">in</input>
// <input mode="speech" score="4">homes</input>
// </input>
//4+1
//4+1+1
//2,2
//3,3
//n,n - last, secondlast

alala = '<interpretation grammar=".SENTENCE" score="2" time="8097,234"><instance>they saw that water sanitation and hygiene are desperately needed in homes</instance><input><input mode="speech" score="3">they</input><input mode="speech" score="3">hygiene</input><input mode="speech" score="1">are</input><input mode="speech" score="1">desperately</input><input mode="speech" score="1">needed</input> <input mode="speech" score="2">in</input><input mode="speech" score="4">homes</input></input>'

alala.indexOf('<input')

//var str = "I learned to play the Ukulele in Lebanon."
var regex1 = /<input/gi, result1, indices1 = [];
while ( (result1 = regex1.exec(alala)) ) {
    indices1.push(result1.index);
}

var regex = /input>/gi, result, indices = [];
while ( (result = regex.exec(alala)) ) {
    indices.push(result.index);
}
//<input
//input>
// fst = [160, 168, 212, 255, 299, 344, 394, 437, 484, 527, 578, 624, 666]
// scd = [161, 205, 248, 292, 337, 387, 430, 477, 520, 571, 617, 659, 704, 713]
// alala.substring(168,205)
// alala.substring(212,248)
// itt = '<input mode="speech" score="3">they</'
// itt.substring(28,29)
// itt.substring(30+1,35)
for (i=0; i<indices1.length-1;i++){
  subsr_input = alala.substring(indices1[i+1],indices[i+1])
  current_score = subsr_input.substring(28,29)
  word_start = subsr_input.indexOf(">")
  word_end = subsr_input.indexOf("</")
  current_word = subsr_input.substring(word_start+1,word_end)
  console.log(current_word);
  console.log(current_score);
}
overall = alala.substring(43,44)
//parseInt("10")
overall = parseInt(alala.substring(43,44))

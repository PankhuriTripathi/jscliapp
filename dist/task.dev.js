"use strict";

var commands = ["add", "del", "done", "ls", "report", "help"];

var fs = require('fs');

var argss = process.argv;

var add_ = function add_() {
  if (argss[3]) {
    var data = argss.slice(3);
    data = data.join(" ");

    if (fs.existsSync("task.txt")) {
      fs.appendFileSync("task.txt", data + "\n", function (err) {
        if (err) throw err;
      });
      var read = fs.readFileSync("task.txt", "utf-8");
      var myregex = /\,/g;
      read = read.replace(/\n*$/, "");
      read = read.split("\n");

      if (read.length > 1) {
        read.sort(function (a, b) {
          if (Number(a.substring(0, a.indexOf(" "))) < Number(b.substring(0, b.indexOf(" ")))) {
            return -1;
          }

          if (Number(a.substring(0, a.indexOf(" "))) > Number(b.substring(0, b.indexOf(" ")))) {
            return 1;
          }

          return 0;
        });
        read = read.toString();
        read = read.replace(myregex, "\n") + "\n";
        fs.writeFileSync("task.txt", read, function (err) {
          if (err) throw err;
        });
      }
    } else {
      fs.writeFileSync("task.txt", data + "\n", function (err) {
        if (err) throw err;
      });
    }

    console.log("Added task: " + "\"" + argss[4] + "\"" + " with priority " + argss[3] + " ");
  } else {
    console.log("Error: Missing tasks string. Nothing added!");
  }
};

var del_ = function del_() {
  if (argss[3]) {
    var read = fs.readFileSync("task.txt", "utf-8");

    if (argss[3] != 0 && argss[3] <= read.split("\n").length - 1) {
      //read.split('\n') =>To convert the string to an array with the newline character as seperator
      //Must be >2 because an empty list will still add a white space and a new line character
      if (read.split("\n").length > 2) {
        console.log("DELETED" + argss[3]);
        read = read.replace(read.split("\n")[argss[3] - 1], '');
        read = read.split("\n");
        read = read.filter(function (e) {
          return e;
        });
        read = read.toString();
        var myRegEx = /\,/g;
        read = read.replace(myRegEx, "\n") + "\n";
        console.log("Deleted task \#" + argss[3]);
        fs.writeFile("task.txt", read, function (err) {
          if (err) throw err;
        });
      } //Case where the list is empty
      else {
          read = '';
          fs.writeFile("task.txt", read, function (err) {
            if (err) throw err;
          });
          console.log("Deleted task \#" + argss[3]);
        }
    } else {
      console.log("Error: task with index" + " \#" + argss[3] + " does not exist. Nothing deleted.");
    }
  } else {
    console.log("Error: Missing NUMBER for deleting tasks.");
  }
};

var report_ = function report_() {
  if (fs.existsSync("task.txt")) {
    var read_task = fs.readFileSync("task.txt", "utf-8");
    read_task = read_task.split("\n");
    read_task = read_task.filter(function (e) {
      return e;
    });
  } else {
    var read_task = 0;
  }

  if (fs.existsSync("completed.txt")) {
    var read_done = fs.readFileSync("completed.txt", "utf-8");
    read_done = read_done.split("\n");
    read_done = read_done.filter(function (e) {
      return e;
    });
  } else {
    var read_done = 0;
  }

  console.log("Pending : " + read_task.length);

  for (i = 0; i < read_task.length; i++) {
    read_task[i].split(i);
    var a = read_task[i].indexOf(' ');
    console.log(i + 1 + "." + " " + read_task[i].substring(a + 1, read_task[i].length) + " " + "[" + read_task[i].substring(0, a) + "]");
  }

  console.log("\n" + "Completed : " + read_done.length);

  for (i = 0; i < read_done.length; i++) {
    read_done[i].split(i);

    var _a = read_done[i].indexOf(' ');

    console.log(i + 1 + "." + " " + read_done[i].substring(_a + 1, read_done[i].length));
  }
};

var ls_ = function ls_() {
  if (fs.existsSync("task.txt")) {
    var read = fs.readFileSync("task.txt", "utf-8");
    read = read.split("\n");
    read = read.filter(function (e) {
      return e;
    }); // read.sort(function(a, b){
    // 	if(Number(a.substring(0,a.indexOf(" "))) < Number(b.substring(0,b.indexOf(" ")))) { return -1; }
    // 	if(Number(a.substring(0,a.indexOf(" "))) > Number(b.substring(0,b.indexOf(" ")))) { return 1; }
    // 	return 0;
    // });

    for (i = 0; i < read.length; i++) {
      var a = read[i].indexOf(' ');
      console.log(i + 1 + "." + " " + read[i].substring(a + 1, read[i].length) + " " + "[" + read[i].substring(0, a) + "]");
    }
  } else {
    console.log("There are no pending tasks!");
  }
};

var done_ = function done_() {
  if (argss[3]) {
    var read = fs.readFileSync("task.txt", "utf-8");
    var myregex = /\,/g; //data here is converted to an array from string and is basically the array element of the specified number

    var data = read.split("\n")[argss[3] - 1]; //Condition to check valid inputs
    //Here the second condition checks the length of the  file data in array form(-1 to eliminate trailing '\n')

    if (argss[3] != 0 && argss[3] <= read.split("\n").length - 1) {
      console.log("Marked item as done.");

      if (read.split("\n").length > 2) {
        read = read.replace(data, '');
        read = read.split("\n");
        read = read.filter(function (e) {
          return e != undefined;
        });
        read = read.filter(function (e) {
          return e;
        });
        read = read.toString();
        read = read.replace(myregex, "\n") + "\n";
        fs.writeFile("task.txt", read, function (err) {
          if (err) throw err;
        });
      } else {
        read = '';
        fs.writeFile("task.txt", read, function (err) {
          if (err) throw err;
        });
      }
    } else {
      console.log("Error: no incomplete item with index \#" + argss[3] + " exists.");
    }

    data = data + "\n";

    if (fs.existsSync("completed.txt")) {
      fs.appendFile("completed.txt", data, function (err) {
        if (err) throw err;
      });
    } else {
      fs.writeFile("completed.txt", data, function (err) {
        if (err) throw err;
      });
    }
  } else {
    console.log("Error: Missing NUMBER for marking tasks as done.");
  }
};

var usage_ = function usage_() {
  var text = "Usage :-\n$ ./task add 2 hello world    # Add a new item with priority 2 and text \"hello world\" to the list\n$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order\n$ ./task del INDEX            # Delete the incomplete item with the given index\n$ ./task done INDEX           # Mark the incomplete item with the given index as complete\n$ ./task help                 # Show usage\n$ ./task report               # Statistics";
  console.log(text);
};

if (argss.length > 2 && commands.indexOf(argss[2]) != -1) {
  switch (argss[2]) {
    case "add":
      add_();
      break;

    case "del":
      del_();
      break;

    case "done":
      done_();
      break;

    case "ls":
      ls_();
      break;

    case "report":
      report_();
      break;

    case "help":
      usage_();
      break;

    case '':
      usage_();
      break;
  }
} else {
  usage_();
}
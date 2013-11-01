/**
 * Created with JetBrains WebStorm.
 * User: lautaro
 * Date: 6/06/13
 * Time: 8:20
 * To change this template use File | Settings | File Templates.
 */

var util = require("../public/js/util/util.js");

//Nodeunit
exports.testRemoveNumber = function(test) {
    var array = [1,2,3,4,5]
    var index = util.Arrays.remove(array,4);
    test.equal(index,3);
    test.equal(array.length,4);
    
    index = util.Arrays.remove(array,6);
    test.equal(index,-1);
    test.equal(array.length,4);
    
    index = util.Arrays.remove(array,{});
    test.equal(index,-1);
    test.equal(array.length,4);
    
    test.done();
    
};

exports.testRemoveString = function(test) {
    var array = ['a','b','c','d']
    var index = util.Arrays.remove(array,'b');
    test.equal(index,1);
    test.equal(array.length,3);
    
    index = util.Arrays.remove(array,'t');
    test.equal(index,-1);
    test.equal(array.length,3);
    
    index = util.Arrays.remove(array,{});
    test.equal(index,-1);
    test.equal(array.length,3);
    
    test.done();
    
};

exports.testRemoveObject = function(test) {
    var array = [{id:'a'},{id:'b'},{id:'c'},{id:'d'}]
    var index = util.Arrays.remove(array,array[2]);
    test.equal(index,2);
    test.equal(array.length,3);
    
    index = util.Arrays.remove(array,{id:'t'});
    test.equal(index,-1);
    test.equal(array.length,3);
    
    index = util.Arrays.remove(array,{});
    test.equal(index,-1);
    test.equal(array.length,3);
    
    //identical object, but not the same
    index = util.Arrays.remove(array,{id:'c'});
    test.equal(index,-1);
    test.equal(array.length,3);
    
    test.done();
};

exports.testRemoveObjectByComparator = function(test) {
    
    var compById = function(id,item) {
        if ( item.id === id) {
            return 0;
        } else {
            return -1;
        }
    };
    
    var array = [{id:'a'},{id:'b'},{id:'c'},{id:'d'}]
    var index = util.Arrays.remove(array,'c',compById);
    test.equal(index,2);
    test.equal(array.length,3);
    
    index = util.Arrays.remove(array,'6',compById);
    test.equal(index,-1);
    test.equal(array.length,3);
    
    //identical object, but not the same
    index = util.Arrays.remove(array,{id:'b'},function(ref,item) {
        if ( item.id === ref.id) {
            return 0;
        } else {
            return -1;
        }
    });
    test.equal(index,1);
    test.equal(array.length,2);
    
    test.done();
};

exports.testFindObject = function(test) {
    var name = 'Jose';
    var compByName = function(item) {
        if ( item.name === name) {
            return 0;
        } else {
            return -1;
        }
    };
    
    var array = [{name:'a'},{name:'b'},{name:'Jose'},{name:'d'}]
    var filtered = util.Arrays.filter(array,compByName);
    test.equal(filtered.length,1);
    
    test.done();
};

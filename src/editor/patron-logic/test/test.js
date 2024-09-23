import { setTailles } from '../../function/setTailles.js'

// cette fonction est appeler depuis script.js
export function appliquerTailles(test) {
    const tailles = {
      // c'est varriable defini dans editor.json
      test
    };
    setTailles(tailles)
}
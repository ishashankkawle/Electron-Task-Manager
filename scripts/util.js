module.exports = class Util 
{
    checkFileExist() 
    {
        try {
            return new Promise((resolve, reject) => {
                fs.access(res["FILE_PATH"] + res["FILE_NAME"], fs.constants.F_OK, (err) => {
                    let obj = true;
                    if (err != null) {
                        obj = false;
                    }
                    resolve(obj);
                });
            });
        }
        catch (error) {
            console.log("Error due to : " + error);
        }

    }
}
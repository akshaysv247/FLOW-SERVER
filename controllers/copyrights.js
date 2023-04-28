/* eslint-disable consistent-return */
const Copyright = require('../model/copyrights');

exports.getReports = async (req, res) => {
  try {
    const reports = await Copyright.find().sort({ createdtAt: -1 });
    if (reports) {
      return res.json({ success: true, reports });
    }
    console.log(reports);
  } catch (err) {
    console.error(err);
  }
};

exports.AddReport = async (req, res) => {
  const { id, songId } = req.params;
  const { reports } = req.body;
  const complaints = {
    report: reports,
    createdBy: id,
    createdAt: new Date(),
  };
  try {
    const report = await Copyright.findOne({ song: songId });
    if (report) {
      const newRep = await Copyright.updateOne({ song: songId }, {
        $push: { complaint: complaints },
      });
      console.log(newRep, 'rep');
      return res.json({ success: true, message: 'reported successfully' });
    // eslint-disable-next-line no-else-return
    } else {
      const reporting = new Copyright({
        song: songId,
        complaint: [{
          report: reports,
          createdBy: id,
          createdAt: new Date(),
        }],
      });
      await reporting.save();
      // console.log(reporting, 'reporting');
      return res.json({ message: 'reported successfully', success: true });
    }
  } catch (error) {
    console.error(error);
  }
};
// exports.deleteAReport = async (req, res) => {
//   const { id } = req.params;
// };

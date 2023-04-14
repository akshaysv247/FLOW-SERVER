/* eslint-disable consistent-return */
const Copyright = require('../model/copyrights');

exports.getReports = async (req, res) => {
  try {
    const reports = await Copyright.find();
    if (reports) {
      return res.json({ success: true, reports });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.AddReport = async (req, res) => {
  const { id } = req.params;
  const { songId, reports } = req.body;
  const complaints = {
    report: reports,
    createdBy: id,
    createdAt: new Date(),
  };
  try {
    const report = await Copyright.findOneAndUpdate({ song: songId });
    if (report) {
      report.complaint.push(complaints);
      await report.save();
      return res.json({ success: false, message: 'reported successfully' });
    }
    const reporting = new Copyright({
      song: songId,
      complaint: [{
        report: reports,
        createdBy: id,
        createdAt: new Date(),
      }],
    });
    console.log(reporting);
    return res.json({ message: 'reported successfully', success: true });
  } catch (error) {
    console.error(error);
  }
};
// exports.deleteAReport = async (req, res) => {
//   const { id } = req.params;
// };

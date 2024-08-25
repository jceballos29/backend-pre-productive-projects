import { BaseService } from '../../../shared/base';
import ProgramModel, { Program, ProgramDocument } from '../models/program';

class ProgramService extends BaseService<Partial<Program>, ProgramDocument> {
  constructor() {
    super(ProgramModel);
  }
}

export default ProgramService;
import { useMutation } from "@tanstack/react-query";
import { uploadProjectContext } from "./projects";

export default function ProjectContextUpload({ projectId }) {
  const [files, setFiles] = useState({});

  const mutation = useMutation({
    mutationFn: (files) => uploadProjectContext(projectId, files),
  });

  const handleChange = (e) => {
    setFiles(prev => ({
      ...prev,
      [e.target.name]: e.target.files[0],
    }));
  };

  const submit = () => mutation.mutate(files);

  return (
    <div>
      <h3>Upload Project Context</h3>

      <input type="file" name="main" accept=".py" onChange={handleChange} />
      <input type="file" name="projects" accept=".js" onChange={handleChange} />
      <input type="file" name="projectForm" accept=".jsx" onChange={handleChange} />

      <button onClick={submit} disabled={mutation.isLoading}>
        Upload Context
      </button>
    </div>
  );
}

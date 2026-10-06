import pandas as pd


def profile_dataset(file_path):
    """
    Generate basic data quality statistics for a CSV file.
    """

    dataframe = pd.read_csv(file_path)

    columns = []

    for column in dataframe.columns:
        series = dataframe[column]

        columns.append(
            {
                "name": column,
                "data_type": str(series.dtype),
                "total_values": int(series.count()),
                "missing_values": int(series.isna().sum()),
                "unique_values": int(series.nunique()),
            }
        )

    return {
        "total_rows": len(dataframe),
        "total_columns": len(dataframe.columns),
        "columns": columns,
    }